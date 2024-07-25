<template>
    <div v-if="show" class="snackbar" :class="{ show: show }">
        {{ message }}
    </div>
</template>

<script>
export default {
props: {
    message: {
    type: String,
    required: true,
    },
    duration: {
    type: Number,
    default: 3000,
    },
},
data() {
    return {
    show: false,
    };
},
methods: {
    display() {
    this.show = true;
    setTimeout(() => {
        this.show = false;
    }, this.duration);
    },
},
watch: {
    message() {
    this.display();
    },
},
};
</script>

<style scoped>
    .snackbar {
    visibility: hidden;
    min-width: 250px;
    margin-left: -125px;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 2px;
    padding: 16px;
    position: fixed;
    z-index: 1;
    left: 50%;
    bottom: 30px;
    font-size: 17px;
    }
    .snackbar.show {
    visibility: visible;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
    }
    @keyframes fadein {
    from {
        bottom: 0;
        opacity: 0;
    }
    to {
        bottom: 30px;
        opacity: 1;
    }
    }
    @keyframes fadeout {
    from {
        bottom: 30px;
        opacity: 1;
    }
    to {
        bottom: 0;
        opacity: 0;
    }
    }
</style>
