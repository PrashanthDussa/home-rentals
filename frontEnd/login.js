function myFunction()
{
 var x=document.getElementById("myInput");
 var y=document.getElementById("hide1");
 var z=document.getElementById("hide2");
if(x.type=='password')
{
x.type="text";
y.style.display="block";
z.style.display="none";
}
else
{
x.type="password";
y.style.display="none";
z.style.display="block";
}
}

// function sendValues()
// {
//     var email = document.getElementById("myEmail").value;
//     var password = document.getElementById("myInput").value;
//     let user={email:email,password: password};
    
//     fetch("/find-account",{
//         method: "POST",
//         headers:{
//             "Content-Type":"application/json"
//         },
//         body:JSON.stringify(user)
//     }).then((res=>{
//         return res.text();
//     })).then((html)=>{
//         document.body.innerHTML=html;
//     })
