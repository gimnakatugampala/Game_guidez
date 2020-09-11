//add admin cloud functions
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit',(e) =>{
    e.preventDefault();
    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({ email:adminEmail }).then(result =>{
        console.log(result);
        // //clear the form
        // const adminEmail = document.querySelector('#admin-email');
        // adminEmail.value = ' ';
    });
});

//auth tracking the user
auth.onAuthStateChanged(user =>{
    if(user){
       /*Verify the admin*/ 
       user.getIdTokenResult().then(idTokenResult =>{
        user.admin = idTokenResult.claims.admin;
        setupUI(user);
    })

        //appending guides
        db.collection('guides').onSnapshot(snapshot =>{
            setupGuide(snapshot.docs)
        },err =>{
            err.message;
        })
    }else {
        setupUI();
        setupGuide([ ]);
    }
})

//create a guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('guides').add({
        title: createForm['title'].value,
        content: createForm['content'].value
    }).then(() =>{
        const modal = document.querySelector('#modal-create');
        M.Modal.getInstance(modal).close();
        createForm.reset(); //reset is method of clearing the form
    }).catch(err =>{
        console.log(err.message);
    })
})


//signup
const signUpForm = document.querySelector('#signup-form');
signUpForm.addEventListener('submit',(e) =>{
    e.preventDefault();

    const email = signUpForm['signup-email'].value;
    const password = signUpForm['signup-password'].value;

    auth.createUserWithEmailAndPassword(email,password).then(cred =>{
        return db.collection('users').doc(cred.user.uid).set({
            bio:signUpForm['signup-bio'].value
        });
    }).then(() =>{
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signUpForm.reset();
    }).catch(err =>{
        signUpForm.querySelector('.error').innerHTML = err.message;
    })
})


//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click',() =>{
    auth.signOut();
})

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit',(e) =>{
    e.preventDefault();

    //enter info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value

    auth.signInWithEmailAndPassword(email,password).then(cred =>{
        // console.log(cred.user)
        //create the modal and reset modal
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    }).catch(err =>{
        loginForm.querySelector('.error').innerHTML = err.message;
    })
})

