# COMP333_HW4
Mobile Frontend (React Native)

Sydney Keller (<smkeller@wesleyan.edu>)
Minji Woo (<mwoo@wesleyan.edu>)

# Purpose:
Learning how to:</br>
1. designing and implementing a mobile app for iOS and Android with React Native</br>
2. connecting your frontend to your REST API from homework 3 to create an integrated mobile and web app with CRUD functionality</br>
3. setting up and using mobile app development tools.

# Setting up the developement environment + how to run code:
1. Set up the backend. This can be done here:</br>
https://github.com/smkeller02/COMP333_HW4_backend</br>
Follow the README in the repo to properly set up the backend
2. Now that the backend is set up, GIT clone this repo onto your desktop or whatever subfolder you prefer
3. NOTE: An IP address is hard coded into every single fetch request. These places are properly noted throughout the code. Please change these IP addresses to your own
4. Through XAMPP, make sure MySQL Database and Apache Web Server are running so that the frontend can speak to the backend to retrieve data
5. Now cd into your COMP333_HW4_frontend folder and run 'npx expo start'. This should then show a QR code and instructions on how to proceed in your terminal


# Folders and Files:
- package-lock.json - automatically generated for any operations where npm modifies either the node_modules tree, or package. json
- package.json - used to store the metadata associated with project as well as store the list of dependency packages
- node_models - folder that comes with react app, holds node modules
- assets - image folder that comes with react native/expo
- App.js - main component
- app.json - created when a new react-native project is initiated, declares environment variables, add-ons, and other information
- babel.config.js - created when a new react-native project is initiated, establishes Babel's core concept of the base directory of your repository
- createuser.js - component that connects with backend to create a new user and log them in
- loginuser.js - component that connects with backend to log user in
- ratings.js - component that displays all ratings data in ratings datatable. Also implements search/filter functionality and deals with updates/deletes/new ratings and user checks.
- delete.js - component that connects with backend to delete a given rating selected by user on frontend
- addnewrating.js - component that connects with backend to add a new rating to the datatable
- update.js - component that connects with backend to update a given rating selected by user on frontend
- view.js - component that lets a user view a single rating
- logout.js - component that logs checks with user if they want to log out

# Sources Cites:
https://expo.dev/ - expo</br>
https://reactnative.dev/docs/environment-setup - setting up react native</br>
https://topdigital.agency/logging-in-react-native-all-you-need-to-know/#:~:text=To%20view%20Console%20logs%2C%20you,directly%20connected%20to%20the%20engine - how to console.log</br>
https://stackoverflow.com/questions/56064993/call-component-through-function-react-native - calling components</br>
https://reactnative.dev/docs/asyncstorage - AsyncStorage</br>
https://reactnavigation.org/docs/native-stack-navigator/ - Stack Navigator</br>
https://reactnavigation.org/docs/navigation-container/ - Navigation Container</br>
https://www.reddit.com/r/reactjs/comments/x7o62m/error_invalid_hook_call_hooks_can_only_be_called/#:~:text=Invalid%20hook%20call.-,Hooks%20can%20only%20be%20called%20inside%20of%20the%20body%20of,the%20Rules%20of%20Hooks%203  - Invalid hook call error</br>
https://htmlcolorcodes.com/ - Hex codes for color</br>
https://stackoverflow.com/questions/35463547/what-is-the-quickest-way-to-convert-a-react-app-to-react-native - converting react to react native</br>
https://www.youtube.com/watch?v=e1r0Xq0XYgU - react to react native</br>
https://oblador.github.io/react-native-vector-icons/ - icons</br>
https://reactnative.dev/docs/scrollview - how to use scrollview</br>
https://stackoverflow.com/questions/52250061/react-native-how-to-call-multiple-functions-when-onpress-is-clicked - Do multiple actions in an onPress</br>
https://stackoverflow.com/questions/59294890/react-navigation-usefocuseffect-is-not-a-function - TypeError for useFocusEffect</br>
https://timmousk.com/blog/git-push-hangs/ - git push stuck</br>
https://stackoverflow.com/questions/66310505/non-serializable-values-were-found-in-the-navigation-state-when-passing-a-functi - non-serializable values warning</br>
https://reactnative.dev/docs/modal - how to use modal</br>
https://stackoverflow.com/questions/45920946/background-color-turns-black-after-onpress-when-displayed-on-top-of-flatlist - TouchableOpacity</br>
https://www.w3schools.com/css/css3_colors.asp - coloring for filter</br>
https://stackoverflow.com/questions/72558495/property-picker-does-not-exist-on-type-appcomponent - Picker</br>