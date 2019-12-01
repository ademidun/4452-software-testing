var self = module.exports = {

  getAgeFactor: function(clientAccount)
    { 
        var factor;

        if (clientAccount.age < 5 || clientAccount.age >120)
            factor = 0;
        else  if (clientAccount.age <10)
            factor = 5;
        else if (clientAccount.age <18)
            factor = 10;
        else if (clientAccount.age <30)
            factor = 20;
        else if (clientAccount.age <70)
            factor = 50;
        else if (clientAccount.age <=120)
            factor = 20;
        return factor;
    },

    getBalanceFactor: function(clientAccount)
    {    
        var factor;

        if (clientAccount.balance <= 0 || clientAccount.balance > 50000)
            factor = 0;
        else if (clientAccount.balance < 100)
            factor = 6;
        else if (clientAccount.balance < 1000)
            factor = 16;
        else if (clientAccount.balance < 10000)
            factor = 30;
        else if (clientAccount.balance < 30000)
            factor = 70;
        else if ( clientAccount.balance < 50000)
            factor = 200;
        return factor;
    },

   accountStatus: function (clientAccount) {

        var factor1 = self.getAgeFactor(clientAccount );

        var factor2 = self.getBalanceFactor(clientAccount );

        var factor3 = factor1 * factor2;

        if (factor3 == 0)
            return "invalid";
        else if (factor3 < 100)
            return "poor";
        else if (factor3 < 500)
            return "fair";
        else if (factor3 < 1000)
            return "good"
        else
            return "very good";
    },

    creditStatus: function (clientAccount, creditCheckMode)

    {
        var scoreThreshold;

        if (clientAccount.creditScore < 0 || clientAccount.creditScore > 100)
        return "invalid";

        if (creditCheckMode ==="strict")
            scoreThreshold=50;
        else if (creditCheckMode ==="default")
            scoreThreshold=75;

        if (clientAccount.creditScore < scoreThreshold)
            return "bad";
        else
            return "good";
    },

    productStatus:  function (product, inventory, inventoryThreshold)
    { 
        var q;

        for (i=0; i <= inventory.length; i++)
        {
            if (product == inventory[i].name)
            {
                q = inventory[i].q;

                if (q == 0)
                    return "soldout";
                else if (q < inventoryThreshold)
                    return "limited"
                else 
                    return "available"
            }
        }

        return "invalid";
    },

   
    orderHandling: function(clientAccount, product, inventory, inventoryThreshold, creditCheckMode)
    {
    var aStautus = self.accountStatus(clientAccount);
    var cStatus = self.creditStatus(clientAccount, creditCheckMode);
    var pStatus = self.productStatus(product, inventory, inventoryThreshold);

    if ((aStautus==="invalid" || cStatus === "invalid" || pStatus === "invalid") || 
            (aStautus==="fair" &&  cStatus==="bad" && pStatus!="available") ||     
            (aStautus==="poor" && cStatus==="good" && pStatus==="soldout") || 
            (aStautus==="poor" && cStatus==="bad" ))
            return "rejected";

        else if ((aStautus==="very good")|| 
                (aStautus==="good" && cStatus==="good")||
                (aStautus!="good" && cStatus==="good" && pStatus==="available"))
            return "accepted";


        else if ((aStautus==="good" && cStatus==="bad") ||
                (aStautus==="fair" 	&& cStatus==="bad" && pStatus==="available"))
            return "underReview";

        else if ((aStautus==="fair" && cStatus==="good" && pStatus!="available") ||
                (aStautus==="poor" && cStatus==="good" && pStatus==="limited"))
            return "pending";
    }
}