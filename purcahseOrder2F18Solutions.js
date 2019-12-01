var assert = require('chai').assert;
var po = require('../src/purchaseOrder2');
var sinon = require('sinon');

// Tests
describe('PurchaseOrder2', function() {
      // ClientAccount class used in functions
      class ClientAccount {
        constructor(age, balance, creditScore) {
          this.age = age;
          this.balance = balance;
          this.creditScore = creditScore;
        }
    }

    // Inventory class used in functions
    class Inventory {
        constructor(productName, productQuantity) {
            this.name = productName;
            this.q = productQuantity;
        }
    }

    describe('orderHandling Complete Coverage Suite', function() {
        // Test accounts and inventory for all cases

        // Rejected accounts
        var invalidAccountStatus = new ClientAccount(0, 0, -5);
        var invalidCreditStatus = new ClientAccount(10, 10, -5);
        var invalidProductStatus = new ClientAccount(10, 10, 5);
        var fairAccountbadCredit = new ClientAccount(17, 5000, 40);
        var poorAccountgoodCredit = new ClientAccount(5, 50, 100);

        // Accepted accounts
        var vgoodAccountStatus = new ClientAccount(40, 40000, 75);
        var goodAccountgoodCredit = new ClientAccount(29, 9999, 100);
        var fairAccountgoodCredit =  new ClientAccount(17, 999, 100);
        var vgoodAccountStatus2 = new ClientAccount(100, 25000, 75);

        // Under Review accounts
        var goodAccountbadCredit = new ClientAccount(29, 9999, 40);

        // Invalid
        var invalidAgeinvalidBalance = new ClientAccount(121, 51000, 50);

        // Setup inventory for these tests
        var inv1 = new Inventory('apple', 0)
        var inv2 = new Inventory('banana', 100)
        var inv3 = new Inventory('grape', 100)
        var invArray = [inv1, inv2, inv3];

        // Rejected paths
        it('should be rejected due to invalid account status', function() {
            assert.equal(po.orderHandling(invalidAccountStatus, 'banana', invArray, 50, 'default'), 'rejected');
        })

        it('should be rejected due to invalid credit status', function() {
            assert.equal(po.orderHandling(invalidCreditStatus, 'banana', invArray, 50, 'default'), 'rejected');
        })

        it('should be rejected due to invalid product status', function() {
            assert.equal(po.orderHandling(invalidProductStatus, 'banana', invArray, 50, 'default'), 'rejected');
        })

        it('should be rejected (fair, bad, not available)', function() {
            assert.equal(po.orderHandling(fairAccountbadCredit, 'apple', invArray, 50, 'default'), 'rejected');
        })

        it('should be rejected (poor, good, soldout)', function() {
            assert.equal(po.orderHandling(poorAccountgoodCredit, 'apple', invArray, 0, 'default'), 'rejected');
        })

        // Accepted paths 
        it("should be accepted due to very good account status", function() {
            assert.equal(po.orderHandling(vgoodAccountStatus, 'banana', invArray, 50, 'default'), 'accepted');
        })

        it("should be accepted due to very good account status 2", function() {
            assert.equal(po.orderHandling(vgoodAccountStatus2, 'banana', invArray, 50, 'strict'), 'accepted');
        })
        it("should be accepted due to good account, good credit", function() {
            assert.equal(po.orderHandling(goodAccountgoodCredit, 'banana', invArray, 50, 'default'), 'accepted');
        })

        it("should be accepted due to account status != good, credit status is good, product is available", function() {
            assert.equal(po.orderHandling(fairAccountgoodCredit, 'banana', invArray, 50, 'default'), 'accepted');
        })

        // Under review paths
        it("should be underReview (good, bad, don't care)", function() {
            assert.equal(po.orderHandling(goodAccountbadCredit, 'banana', invArray, 50, 'default'), 'underReview');
        })

        it("should be underReview (fair, bad, available)", function() {
            assert.equal(po.orderHandling(fairAccountbadCredit, 'banana', invArray, 50, 'default'), 'underReview');
        })  

        // Pending paths
        it("should be pending (fair, good, not available)", function() {
            assert.equal(po.orderHandling(fairAccountgoodCredit, 'banana', invArray, 150, 'default'), 'pending');
        })

        it("should be underReview (poor, good, limited)", function() {
            assert.equal(po.orderHandling(poorAccountgoodCredit, 'banana', invArray, 150, 'default'), 'pending');
        })

        // Invalid paths
        it("should not be a possible path (invalid, invalid, ?)", function() {
            assert.equal(po.orderHandling(invalidAgeinvalidBalance, 'apple', invArray, 150, 'invalidMode'), 'rejected');
        })
    })

    describe('orderHandling Integration MM-Path', function() {
        // Accounts
        var fairAccountbadCredit = new ClientAccount(17, 5000, 40);
        var goodAccountgoodCredit = new ClientAccount(29, 9999, 100);
        var fairAccountgoodCredit = new ClientAccount(17, 5000, 100);

        // Inventory
        var inv1 = new Inventory('apple', 0)
        var inv2 = new Inventory('banana', 100)
        var inv3 = new Inventory('grape', 100)
        var invArray = [inv1, inv2, inv3];

        it("Path 1 - (fair, bad, not available)", function() {
            assert.equal(po.getAgeFactor(fairAccountbadCredit), 10);
            assert.equal(po.getBalanceFactor(fairAccountbadCredit), 30);
            assert.equal(po.accountStatus(fairAccountbadCredit), 'fair');
            assert.equal(po.creditStatus(fairAccountbadCredit, 'default'), 'bad');
            assert.equal(po.productStatus('apple', invArray, 150), 'soldout');
            assert.equal(po.orderHandling(fairAccountbadCredit, 'apple', invArray, 150, 'default'), 'rejected');
        })

        it("Path 2 - (good, good, available)", function() {
            assert.equal(po.getAgeFactor(goodAccountgoodCredit), 20);
            assert.equal(po.getBalanceFactor(goodAccountgoodCredit), 30);
            assert.equal(po.accountStatus(goodAccountgoodCredit), 'good');
            assert.equal(po.creditStatus(goodAccountgoodCredit, 'default'), 'good');
            assert.equal(po.productStatus('banana', invArray, 50), 'available');
            assert.equal(po.orderHandling(goodAccountgoodCredit, 'banana', invArray, 50, 'default'), 'accepted');
        })

        it("Path 3 - (fair, bad, available)", function() {
            assert.equal(po.getAgeFactor(fairAccountbadCredit), 10);
            assert.equal(po.getBalanceFactor(fairAccountbadCredit), 30);
            assert.equal(po.accountStatus(fairAccountbadCredit), 'fair');
            assert.equal(po.creditStatus(fairAccountbadCredit, 'default'), 'bad');
            assert.equal(po.productStatus('banana', invArray, 50), 'available');
            assert.equal(po.orderHandling(fairAccountbadCredit, 'banana', invArray, 50, 'default'), 'underReview');
        })

        it("Path 4 - (fair, good, not available)", function() {
            assert.equal(po.getAgeFactor(fairAccountgoodCredit), 10);
            assert.equal(po.getBalanceFactor(fairAccountgoodCredit), 30);
            assert.equal(po.accountStatus(fairAccountgoodCredit), 'fair');
            assert.equal(po.creditStatus(fairAccountgoodCredit, 'default'), 'good');
            assert.equal(po.productStatus('apple', invArray, 50), 'soldout');
            assert.equal(po.orderHandling(fairAccountgoodCredit, 'apple', invArray, 50, 'default'), 'pending');
        })
    })
})