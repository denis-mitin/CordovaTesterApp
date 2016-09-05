/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app;
app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'


    callMethod: function () {
        //console.log('in Call method');
        //alert('in Call method');
        var textLog = document.getElementById("txtres");

        //document.getElementById("txtres").value = "Call method pressed\n";

        var method = document.getElementById("method").value;
        var params = eval("(" + document.getElementById("params").value + ")");

        document.getElementById("txtres").value += "Calling " + method + " with params " + document.getElementById("params").value + "\n";

        if (method == "login") {
            var prov = params.provider;
            delete params.provider;

            gigyaClient.loginToProvider(prov, params)
                .then(function(response) {
                    document.getElementById("txtres").value += "Success \n" + JSON.stringify(response.data);
                })
                .catch(function(error) {
                    document.getElementById("txtres").value += "Error \n" + JSON.stringify(error.data);
                });
        }
        else if (method == "logout") {
            gigyaClient.logout();
        }
        else if (method == "accounts.screenSet" || method == "gm.notifications" || method.indexOf("UI") != -1) {
            gigyaClient.showPlugin(method, params, {
                onLoad: function (event) {
                    document.getElementById("txtres").value += "onLoad event \n";
                    //document.getElementById("txtres").value += (JSON.stringify(event.detail));
                },
                onError: function (event) {
                    document.getElementById("txtres").value += "onError event \n";
                    document.getElementById("txtres").value += (JSON.stringify(event.detail));
                },
                onAfterSubmit: function (event) {
                    document.getElementById("txtres").value += "AfterSubmit event \n";
                    document.getElementById("txtres").value += (JSON.stringify(event.detail));
                },
                onDismiss: function (event) {
                    document.getElementById("txtres").value += "Dissmiss event \n";
                    //document.getElementById("txtres").value += (JSON.stringify(event.detail));
                }
            });

        }

        else {
            gigyaClient.sendRequest(method, params, true)
                .then(function(response) {
                    document.getElementById("txtres").value += "Success \n" + JSON.stringify(response.data);
                })
                .catch(function(error) {
                    document.getElementById("txtres").value += "Error \n" +JSON.stringify(error.data);
                });
        }

    },

    setSelect: function () {
        //alert('in setSelect');
        var paramsBox = document.getElementById("params");

        switch (document.getElementById("method").value) {
            case "login" :
                paramsBox.value = "{\"provider\":\"facebook\"}";
                break;
            case "accounts.screenSet" :
                paramsBox.value = "{\"screenSet\":\"mobile-RegistrationLogin\"}";
                break;
            case "comments.commentsUI" :
                paramsBox.value = "{\"categoryID\":\"ios\"}";
                break;
            default :
                paramsBox.value = "{}";
        }
    },

    onDeviceReady: function () {
        console.log('on device ready');

        document.getElementById("callBtn").addEventListener("click", app.callMethod);

        document.getElementById("method").addEventListener("change", app.setSelect);

        document.getElementById("txtres").addEventListener('dblclick', function(){

            document.getElementById("txtres").value="";

        });

        gigyaClient.init('3_wJo2JBfQO09OzjVvvt6F-0oEd8igVPLLRRXXqgNGvOkQyVUP9wWZxg_kIEMnbE9n', 'us1.gigya.com');
//        console.log(gigyaClient.getVersion());
        gigyaClient.addEventListener(gigyaClient.Event.LOGIN, app.onLogin);
        gigyaClient.addEventListener(gigyaClient.Event.LOGOUT, app.onLogout);

        app.setSelect();

        //gigyaClient.showPlugin('accounts.screenSet', {screenSet: 'Android-RegistrationLogin'});
    },
    onLogin: function (event) {
        //alert(JSON.stringify(event.detail));
        document.getElementById("txtres").value += "Login event +\n" +JSON.stringify(event.detail);
    },
    onLogout: function () {
        //alert("Logout");
        document.getElementById("txtres").value += "\nLogout event\n";
    }


};

app.initialize();



