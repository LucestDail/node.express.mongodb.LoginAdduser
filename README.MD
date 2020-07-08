<html><body>
<br>
<h1>
READ IT FIRST AND ANYTHING YOU WOULD LIKE TO CONTACT ME, MAIL IT TO DHTMDGUSSKSM@GMAIL.COM
</h1>
<br>
<h2><pre>
1. Project name : node.express.mongodb.loginAdduser
    1-1. This project is my testing project for connect with node, express, and mongodb
    1-2. DATE : 2020. 6. 25. 11:20(KR)
</pre></h2>
<br>
<h3><pre>
2. Project information
    2-1. Node(Express included)
        - Module information : package.json
        - npm : 6.14.5
        - node : 12.18.0
    2-2. Mongoose Version
        - Module information : package.json
        - Version : 5.9.20
    2-3. Mongoose editer
        - MongoDB Compass Community 1.21.2
    2-4. Code editer
        - Brackets : splint 14 build 1.14.2-17770 (release-1.14.2 f71f00acc) 
</pre></h3>
<br>
<h3><pre>
3. Contribute
    3-1. following example, Write your contribute 
<blockquote>
    3-1. 2020. 6. 27 12:30(KR)
        3-1-1. Modifiy
                A. Change topic for this reason
                B. Modify Value for that reason
                C. NPM updated(6.14.4 -> 6.14.5)
        3-1-2. Add
                A. Add this code for this reason
                B. Add this function for that reason
                C. Add this module for these reason
        3-1-3. Remove
                A. Remove this code for this reason
                B. Remove this function for that reason
                C. Remove this module for these reason
        3-1-4. ETC
                A. Stabilize this code for this reason, it came this result
                B. NPM updated(6.14.4 -> 6.14.5)
</blockquote>
</pre></h3>
<h3><pre>
4. Code Status
    4-1. 2020. 6. 25. 19:05(KR)
        4-1-1. Modification.
                A. Function about authorization and db contact for checkout list(who use adduse function)
    4-2. 2020. 6. 26 16:20(KR)
        4-2-1. Modifiy
                A. Directory(whole file -> public filr) because it show html file depend on path module clearly.
                B. Change main frame code name(dbtest -> signup) becuase it show what this code want to be and performance
        4-2-2. Add
                A. Virtual function have added because for encryption process.
                I do want to make sure what hash is and want to build safe signup process as much as i can. So i think password is not safe while signup process so it gonna be made up virtual object and when hashing is over, then it save
                B. Encrytion function have added.
                This time, i try hashing algorithm using SHA1 and it is One-way Encryption because i want to make it sure safety.
        4-2-3. ETC
                A. NPM updated(6.14.4 -> 6.14.5)
    4-3. 2020. 6. 29. 14:45(KR)
        4-3-1. Modifiy 
                A. Change main code name(signup -> main) because it works for main utility
                B. Change main code which modulate for modify more easily when ERROR occured
        4-3-2. Add
                A. Adding modulated code(user_schema, user, route, database, config)
                    - user_schema : create default user schema for database and hashing password security
                    - user : managing user like adding, login and list up utility
                    - route : when html request route call, then this code work for respond router utilty
                    - database : connect database an set data about mongoose data utility
                    - config : setting basic set for connection
                B. Adding 404 html Page for error-handling
    4-4. 2020. 6. 30. 12:10(KR)
        4-4-1. Modifiy 
                A. Change user code for using ejs code main utility
                B. Change main code ejs module for using ejs module and set file path
        4-4-2. Add
                A. view module ejs code(adduser(head,footer), listuser, login_success)
                    - adduser : print when add route/addUser functon finished well
                    - head : head ejs html file for adduser.ejs
                    - footer : foot ejs html file for adduser.ejs
                    - listuser : print listuser functin
                    - login_success : print when login route/authUser function finsihed well
                B. view files for saving ejs files
    4-5. 2020. 7. 2. 20:30(KR)
        4-5-1. Modifiy 
                A. Change user code for using passport module
        4-5-2. Add
                A. Add passport module(but it is not work now, gonna fix)
                B. Add ejs file(signup, index, profile)
    4-6. 2020. 7. 3. 09:40(KR)
        4-6-1. Modifiy 
                A. Change main code for using passport(stabilize for connecting ejs and javascript)
                B. Change main code router(not app module dependency, use router module for acting user process)
    4-7. 2020. 7. 4. 09:40(KR)
        4-7-1. Modifiy 
                A. Change main code for modulation
                B. Change user passport for using passport bia facebook(not work yet)
        4-7-2. Add
                A. Add facebook passport module(it is not work yet cause of model creation)
        4-7-3. Remove
                A. Remove main code router and added it to config.js and user_passport.js
    4-8. 2020. 7. 6. 21:40(KR)
        4-8-1. ETC
                A. Passport bia facebook gonna be terminated because cant find why hashed_password path has been activated... 
    4-9. 2020. 7. 7. 17:50(KR)
        4-9-1. Modifiy 
                A. Change main code for adding chating module(using socket.io)
        4-9-2. Add
                A. Add chat01 ~ 03 html file for checking, testing and struct chatting utility
    4-10. 2020. 7. 8. 13:20(KR)
        4-10-1. Modifiy 
                A. Change main code for adding group chating
                B. Change Chat.html file for adding utility about group chatting room creating, updating, and deleting.(it also depend on main.js chat/socket.io middleware)
</pre></h3>
<br>
<h3><pre>
5. Caution
    5-1. MIT LICENSE
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
</pre></h3>
</body></html>