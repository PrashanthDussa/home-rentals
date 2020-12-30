function myFunction() {
     var x = document.getElementById('myInput');
     var y = document.getElementById('hide1');
     var z = document.getElementById('hide2');
     if (x.type == 'password') {
          x.type = 'text';
          y.style.display = 'block';
          z.style.display = 'none';
     } else {
          x.type = 'password';
          y.style.display = 'none';
          z.style.display = 'block';
     }
}
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
//     }).then((res)=>{
//         if(res.status===404)
//         {
//            window.location.assign("/noUser.html");
//         }
//         else if(res.status===400)
//         {
//             window.location.assign("/invalidPassword.html");
//         }
//         else{
//             window.location.assign("/selectOption")
//               return res.text();
//         }
//      }).then((token)=>{
//         // var a = JSON.stringify(data);
//         // var b = JSON.parse(a);
//         // alert(b.firstName);
//         sessionStorage.token = token;
//     })

// }

// $(function()
// {
//    $("#button").click(function()
//    {
//        var email=$("#myEmail").val();
//        var password=$("#myInput").val();
//        $.post("/find-account",{email:email,password:password},function(res,status)
//        {
//            if(res==="noUser")
//            {
//                      window.location.assign("/noUser.html");
//            }
//            else if(res=="invalidPassword")
//            {
//                window.location.assign("/invalidPassword.html");
//            }
//            else{
//             window.location.assign("/selectOption.html");
//            }

//        });
//    })
// })
