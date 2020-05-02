    $(function()
    {
        $("#bac").click(function()
        {
            if($("#bac").prop("checked"))
          $("#fam").attr("disabled",true);
          else
          $("#fam").attr("disabled",false);
        });
        $("#fam").click(function()
        {
            if($("#fam").prop("checked"))
          $("#bac").attr("disabled",true);
          else
          $("#bac").attr("disabled",false);
        });
        $("#button").click(function()
        {
            if($("#bac").prop("checked")===false && $("#fam").prop("checked")===false)
            alert("please select either of the checkboxes");
      
        });
    });
