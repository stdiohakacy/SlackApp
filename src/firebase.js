import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/database"
import "firebase/storage"

/* Default rules
https://console.firebase.google.com/u/0/project/slack-app-63696/storage/slack-app-63696.appspot.com/rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
  	match /{allPaths=**} {
    	allow read, write: if request.auth != null;
    }
  } 
}
*/


/*
rules_version = '2';
service firebase.storage {
  match /b/slack-app-63696.appspot.com/o {
  	match /avatars {
			match /users/{userId} {
      	allow read: if request.auth != null;
        allow write: if request.auth != null && request.auth.uid == userId && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
      }
    }
    
    match /chat {
    	match /public/{imagePath=**} {
      	allow read: if request.auth != null;
        allow write: if request.auth != null && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024;
      }
      
      match /private/{userId1}/{userId2}/{imagePath=**} {
      	allow read: if request.auth != null && (request.auth.uid == userId1 || request.auth.uid == userId2);
        allow write: if request.auth != null && (request.auth.uid == userId1 || request.auth.uid == userId2) && request.resource.contentType.matches('image/.*') && request.resource.size < 1 * 1024 * 1024
      }
    }
  } 
}
*/

/*
{
  "rules": {
    "channels" : {
      ".read": "auth != null",
      "$channelId": {
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['id', 'name', 'createdBy', 'details'])",
        "id": {
          ".validate": "newData.val() === $channelId"
        },
        "name": {
          ".validate": "newData.val().length > 0"
        },
        "details": {
          ".validate": "newData.val().length > 0"
        }
      }
    },
    "messages": {
      "$channelId": {
        ".read": "auth != null",
        ".validate": "root.child('channels/'+$channelId).exists()",
        "$messageId": {
          ".write": "auth != null",
          ".validate": "(newData.hasChildren(['content', 'user', 'timestamp'])) && !newData.hasChildren(['image']) || (newData.hasChildren(['image', 'user', 'timestamp'])) && !newData.hasChildren(['content'])",
          "content": {
            ".validate": "newData.val().length > 0"
          },
          "image": {
            ".validate": "newData.val().length > 0"
          },
          "user": {
            ".validate": "newData.hasChildren(['id', 'name', 'avatar'])"
          }
        }
      }
    },
    "privateMessages": {
      "$uid1": {
        "$uid2": {
          ".read": "auth != null && ($uid1 === auth.uid || $uid2 === auth.uid)",
          "$messageId": {
            ".write": "auth != null",
            ".validate": "(newData.hasChildren(['content', 'user', 'timestamp'])) && !newData.hasChildren(['image']) || (newData.hasChildren(['image', 'user', 'timestamp'])) && !newData.hasChildren(['content'])",
          },
          "content": {
            ".validate": "newData.val().length > 0"
          },
          "image": {
            ".validate": "newData.val().length > 0"
          },
          "user": {
            ".validate": "newData.hasChildren(['id', 'name', 'avatar'])"
          }
        }
      }
    },
    "presence": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "typing": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['name', 'avatar'])",
        "name": {
          ".validate": "newData.val().length > 0"
        },
        "avatar": {
          ".validate": "newData.val().length > 0"
        }
      }
    }
  }
}
*/
const firebaseConfig = {
    apiKey: "AIzaSyD4N35_56fUS-gcR03pbE08EwRK8q9el7k",
    authDomain: "slack-app-63696.firebaseapp.com",
    databaseURL: "https://slack-app-63696.firebaseio.com",
    projectId: "slack-app-63696",
    storageBucket: "slack-app-63696.appspot.com",
    messagingSenderId: "454448373617",
    appId: "1:454448373617:web:596d528948858b7652a0d0",
    measurementId: "G-81GKKNZHGX"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
// firebase.analytics()

export default firebase
