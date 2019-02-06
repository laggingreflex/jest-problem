<template lang="html">
    <div class="user-picker-wrapper">
        <input ref="searchTerm" autocomplete="off" class="form-control input-md" placeholder="User" type="text" v-model="searchTerm">
        <span class="loading-bar" v-if="loading">
            <img style="max-width:100%; max-height:100%;" src="/static/img/loading.gif" alt="">
        </span>
        <div class="user-list" v-if="userList.length > 0 && searchTerm" >
            <div class="list-group" >
                <div class="list-group-item" v-for="(user, index) in userList" @click="updateProp(index)" class="click-row">
                    <i class="fa fa-user picker-icon"></i>
                    <div class="content">
                        <span class="list-group-item-heading"> 
                            <span class="picker-name">{{ user.full_name }}</span>  
                            <span v-if="user.roles">({{ user.roles }})</span> 
                        </span>
                        <div class="list-group-item-text"> 
                            <span class="picker-address">{{ user.email }}</span> 
                            <br> 
                            <span v-if="user.full_address" class="picker-address">{{ user.full_address }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'

export default {
    data: function () {
        return {
            searchTerm: this.user.full_name || '',  // from dan
            userList: [],
            loading: false,
            loadedUser: false,
        }
    },
    watch: {
        searchTerm () {
            this.searchUser()
        }
    },
    props: {
        user: {
            type: null
        },
        grabFocus: {
            type: Boolean,
            default: false
        },
        changeSelectedUserInSession: {
            type: Boolean,
            default: false
        },
        loadCurrentUser: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        updateProp (index) {
            var vm = this
            this.searchTerm = this.userList[index].full_name
            this.loadedUser = this.userList[index]
            this.$emit('update:user', this.userList[index])
            if (this.changeSelectedUserInSession || this.loadCurrentUser) {
                // If this variable is set for an instance of the user picker
                // It will make a call to the server to change the user in the session variable
                // `select_user` which will enable data pulls to be for a user other than the
                // one logged in.
                $.ajax({
                    url: "/users/dashboard/select_user/" + this.userList[index].id,
                    success: function(result) {
                        if (!vm.loadCurrentUser && vm.changeSelectedUserInSession) {
                            window.location.reload(true)
                        }
                    }
                })
            }
            this.userList = []
        },
        searchUser: _.debounce(function () {
            var vm = this
            vm.loading = true
            $.ajax({
                url: '/admin/api/users?search_term=' + vm.searchTerm,
                success: function (data) {
                    if (data.users.length === 1 && data.users[0].full_name === vm.loadedUser.full_name) {
                        vm.userList = []
                        vm.loading = false
                        return
                    }
                    vm.userList = data.users
                    vm.loading = false
                }
            })
        }, 500)
    },
    mounted() {
        var vm = this
        if (vm.changeSelectedUserInSession || vm.loadCurrentUser) {
            $.ajax({
                url: '/users/dashboard/select_user/modify/current',
                success: function (data) {
                    vm.searchTerm = data.user ? data.user.full_name : ''
                    vm.loadedUser = data.user
                    vm.$emit('update:user', data.user)
                }
            })
        }
        if (vm.grabFocus) {
            // If the component is initialized with `grabFocus="true"` then we want to
            // make sure that the user input focus is set to the userpicker (assuming it is visible)
            // otherwise, we don't want to do anything special. This is primarily used only
            // for the instance when the user picker component is used in the "loginAs" component
            var focusInterval = setInterval(function (){
                if (document.getElementById('userpicker') && document.getElementById('userpicker').classList.contains('in')) {
                    vm.$refs.searchTerm.focus()
                }
            }, 250)
        }
    }
}
</script>

<style lang="css" scoped>
.user-picker-wrapper {
    position: relative;
}
.loading-bar {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 50px;
    clip-path: circle(10px at 27px 20px);
    z-index: 2000;
}
.user-list {
    max-height: 525px;
    overflow-y: scroll;
    position: absolute;
    background: #fff;
    margin: 0px;
    padding-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
    border-radius: 10px;
    z-index: 1000;
    top: 35px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.click-row {
    cursor: pointer;
    text-align: left;
    padding-top: 8px;
    padding-bottom: 8px;
    min-height: 40px;
    min-width: 420px;
    border-bottom: 1px solid #dadada;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-button {
  width: 23px;
  height: 23px;
}
::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 6px none #ffffff;
  border-radius: 24px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
::-webkit-scrollbar-thumb:active {
  background: #444444;
}
::-webkit-scrollbar-track {
  background: #ffffff;
  border: 4px none #ffffff;
  border-radius: 42px;
}
::-webkit-scrollbar-track:hover {
  background: #ffffff;
}
::-webkit-scrollbar-track:active {
  background: #ffffff;
}
::-webkit-scrollbar-corner {
  background: transparent;
}

.click-row:hover {
    background-color: #f1f1f1;
}
.picker-address {
    font-size: 12px;
}
.picker-table {
    margin-bottom: 5px !important;
}
.picker-icon {
    float: left;
    font-size: 30px;
    padding: 7px 12px 7px 13px;
    color: #cecece;
}
.picker-name {
    color: #23527c;
    font-size: 18px;
}
</style>
