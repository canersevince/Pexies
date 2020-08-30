import axios from "axios";
axios.defaults.baseURL = location.protocol + "//" + location.host
export const authModule = {
    state: {
        auth: false,
        user: {}
    },
    mutations: {
        successfulAuth(state: any, payload: {}){
            state.auth = true
            state.user = payload
        }
    },
    actions : {
        signup(state: any, {$buefy, User, $router, Login, Close}: any) {
            console.log('new user info:', User)
            axios.post('/api/user/signup', User).then(res => {
                const { data } = res
                console.log(data)
                if(data.error){
                    if(data.code == 'exists'){
                        $buefy.toast.open({
                            message: data.error,
                            type: "is-warning"
                        })
                    }
                } else {
                    if(data.username){
                        if (data.username.toString().toLowerCase() == User.username.toString().toLowerCase()) {
                            $buefy.toast.open({
                                message: "Account created!",
                                type: "is-success"
                            })
                            Close()
                            Login(data)
                        }
                    }
                }
            }).catch(err => {
                console.log(err)
                $buefy.toast.open({
                    message: "There was en error while authentication. Please retry."+err.data,
                    type: "is-warning"
                })
            })
        },
        login(state: any, {$buefy, User, $router, Close}: any) {
            axios.post('/api/user/login', User).then(res => {
                const { data } = res;
                console.log(data)
                if (data && data.username && data.username.toLowerCase() == User.username.toLowerCase()) {
                    state.commit('successfulAuth')
                    $buefy.toast.open({
                        message: `Welcome, ${data.username.charAt(0)+data.username.substring(1,data.username.length)}!`,
                        type: "is-success"
                    })
                    Close()
                } else if (data.error){
                    if(data.code == 'not_found'){
                        $buefy.toast.open({
                            message: data.error,
                            type: "is-danger"
                        })
                    } else {
                        $buefy.toast.open({
                            message: "There was en error while authentication. Please retry.",
                            type: "is-danger"
                        })
                    }
                }
            }).catch(err => {
                $buefy.toast.open({
                    message: "There was en error while authentication. Please retry."+ err.data
                })
            })
        },
    }
}
