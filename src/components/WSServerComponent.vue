<template>
<v-layout>
    <!-- HERE -->
    <iframe title="wswebserver" id="ifrm" :src="url" width="100%" height="400%"></iframe>
</v-layout>
</template>

<script>
import {
    getAuth,
    onAuthStateChanged
} from "firebase/auth";
import {
    firebaseApp
} from "../firebase";
import {
    getFirestore,
    doc,
    getDoc
} from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    components: {},
    data: () => ({
        url: null,
    }),
    watch: {},
    mounted() {},
    created() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.getUserData(user.uid);
            }
        });
    },
    methods: {
        async getUserData(uid) {
            const userRef = doc(db, "profiles", uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                this.url = "http://localhost:8000/";//userSnap.data().server;
                console.log(this.url);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        },
    },
};
</script>
