<template>
    <div class="card-cookie" v-if="show">
        <div class="text">
            <p>{{$t('partone')}} <span class="red">cookie</span> {{$t('parttwo')}}</p>
        </div>
        <div class="container">
            <button @click="acceptCookies">{{$t('accept')}}</button>
        </div>        
    </div>
</template>

<script>
export default {
    data() {
        return {
            show: true,
        }
    },
    mounted() {
        // Проверяем, принял ли пользователь куки
        if (localStorage.getItem('cookieConsent')) {
            this.show = false; // Скрываем модальное окно, если куки приняты
        }
    },
    methods: {
        acceptCookies() {
            // Сохраняем согласие в Local Storage
            localStorage.setItem('cookieConsent', 'true');
            this.show = false; // Скрываем модальное окно
        }
    }
}
</script>

<style scoped>
.text {
    width: 100%;
    word-wrap: break-word; /* перенос слов при необходимости */
    box-sizing: border-box; 
}
.card-cookie {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    background-color: white;
    padding: 20px;
    border: 1px solid #EEF1F9;
    border-radius: 16px;
    gap: 10px;
}
.red {
    color: red;
}
.container button {
    background-color: #CF0032;
    padding: 10px 18px;
    color: white;
    border-radius: 10px;
    border: 1px solid #CF0032;
    width: 80%;
}
.container {
    width: 100%;
    display: flex;
    justify-content: center;
}
@media(max-width: 420px) {
    .card-cookie {
        width: 90%;
    }
}
</style>