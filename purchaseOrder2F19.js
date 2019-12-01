const getAgeFactor=function(clientAccount ) {
    let factor ;

    if (clientAccount.age <15 || clientAccount.age >= 110)

        factor= 0;

    else  if (clientAccount.age <20)

        factor = 5;

    else if (clientAccount.age <30)

        factor= 10;

    else if (clientAccount.age <40)

        factor=20;

    else if (clientAccount.age <65)

        factor =50;

    else if (clientAccount.age <110)

        factor =20;

    return factor;

};
const getBalanceFactor=function (clientAccount ) {
    let factor;


    if (clientAccount.balance <= 0 || clientAccount.balance >= 5000)

        factor = 0;

    else if (clientAccount.balance < 100)

        factor = 6;

    else if (clientAccount.balance < 500)

        factor = 16;

    else if (clientAccount.balance < 1000)

        factor = 30;

    else if (clientAccount.balance < 3000)

        factor = 70;

    else if ( clientAccount.balance < 5000)

        factor = 200;

    return factor;

};
const accountStatus=function (clientAccount ) {

    let factor1 = getAgeFactor(clientAccount );

    let factor2 = getBalanceFactor(clientAccount );

    let factor3 = factor1 * factor2;

    if (factor3 === 0)

        return "invalid"
            ;
    else if (factor3 < 100)

        return "adverse";

    else
    if (factor3 < 500)

        return "acceptable";

    else if (factor3 < 1000)

        return "good";

    else

        return "excellent";

};
const creditStatus=function (clientAccount,creditCheckMode) {
    let scoreThreshold;

    if (clientAccount.creditScore <0 || clientAccount.creditScore >100)

        return "invalid";


    if (creditCheckMode === "restricted")

        scoreThreshold=50;

    else if (creditCheckMode === "default")

        scoreThreshold=75;

    if (clientAccount.creditScore < scoreThreshold)

        return "adverse";

    else return "good";

};
const productStatus=function (product,inventory,inventoryThreshold) {
    let q;

    for (let i=0;i<inventory.length;i++){
        if (product === inventory[i].name){
            q=inventory[i].q;

            if (q===0)
                return "soldout";

            else if (q < inventoryThreshold)
                return "limited";

            else return "available"
        }
    }
    return "invalid";
};

const orderHandling=function(clientAccount ,product,inventory,inventoryThreshold,creditCheckMode) {


    let aStatus=accountStatus(clientAccount );

    let cStatus=creditStatus(clientAccount ,creditCheckMode);

    let pStatus=productStatus(product,inventory,inventoryThreshold);

    if (
        ([aStatus, cStatus, pStatus].includes("invalid"))||
        (aStatus=== "acceptable" &&  cStatus=== "adverse" && (pStatus ==="limited" || pStatus=== "soldout")) ||
        (aStatus=== "adverse" && cStatus=== "good" && pStatus=== "soldout") ||
        (aStatus=== "adverse" && cStatus=== "adverse" ))
        return "rejected";

    else if ((aStatus=== "excellent")||
        (aStatus=== "good" && cStatus=== "good")||
        ( (aStatus=== "acceptable" || aStatus === "adverse") && cStatus=== "good" && pStatus=== "available"))
        return "accepted";


    else if ((aStatus=== "good" && cStatus === "adverse")||(aStatus=== "acceptable" && cStatus=== "adverse"
        && pStatus=== "available"))
        return "underReview";

    else if ((aStatus === "acceptable" && cStatus=== "good" && pStatus !== "available")
        ||(aStatus=== "adverse" && cStatus=== "good" && pStatus=== "limited"))
        return "pending";


};

module.exports = {
    getAgeFactor, getBalanceFactor, accountStatus, creditStatus,
    productStatus, orderHandling
};