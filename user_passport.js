module.exports = function(router, passport){
    console.log('user_passport function has been called');
    //basic platform rendering router
    router.route('/').get(function(req,res){
        console.log('/ path has been called');
        console.log('req.user object value');
        console.dir(req.user);
        if (!req.user) {
            console.log('user account is not authenticated yet');
            res.render('index.ejs', {login_success:false});
        } else {
            console.log('user account already authenticated');
            res.render('index.ejs', {login_success:true});
        }
    });

    //login router
    router.route('/login').get(function(req, res) {
        console.log('/login path has been called');
        res.render('login.ejs',{message : req.flash('loginMessage')});
    });
    
    //singup rendering router
    router.route('/signup').get(function(req, res) {
        console.log('/signup path has been called');
        res.render('signup.ejs',{message : req.flash('signupMessage')});
    });

    //profile rendering router
    router.route('/profile').get(function(req,res){
        console.log('/profile path has been called');
        console.log('req.user object value');
        console.dir(req.user);
        if(!req.user){
            console.log('none authenticated user');
            res.redirect('/');
        }else{
            console.log('authenticated user, profile path called');
            console.dir(req.user);
            if(Array.isArray(req.user)){
                res.render('profile.ejs', {user : req.user[0]._doc});
            }else{
                res.render('profile.ejs',{user:req.user});
            }
        }
    });
    
    //logout router
    router.route('/logout').get(function(req, res) {
        console.log('/logout path has been called');
        req.logout();
        res.redirect('/');
    });
    
    //login authentication router
    router.route('/login').post(passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));
    
    //singup authentication router
    router.route('/signup').post(passport.authenticate('local-signup', {
        successRedirect : '/profile', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
    
    router.route('/auth/facebook').get(passport.authenticate('facebook', { 
        scope : 'email' 
    }));
    
    router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
    


};