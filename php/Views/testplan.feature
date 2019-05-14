## To report typos and inconsistencies contact amoud@adaptco.ca
Feature: Forgot Password
  Scenario: Admin forgot password
    Given I am on "admin/login"

    When I click on "Forgot Password?"
    And I give a random admin email
    And I click "Reset"
    Then I should see "Email Does Not Exist In Our Records"

    When The new password length is less than 8 or larger than 16
    Then I should see "Password Must Be Between 8 And 16 Characters Long"

    When The "new password" does not match "confirm password"
    Then I should see "Confirm Password Does Not Match New Password"

    When I give a valid admin email
    Then I should see "A Reset Link Has Been Sent To Your Email, The Link Expires In One Hour"
    And I should recieve an email with a link to the password reset page

    When I fill out the Admin Password Reset form correctly
    Then I should be redirected to the login page

    When I log in with the new password
    Then I should be allowed access to the admin dashboard

  Scenario: Partner forgot password
    Given I am on "partner/login"

    When I click on "Forgot Password?"
    And I give a random partner id
    And I click "Reset"
    Then I should see "Partner Does Not Exist In Our Records"

    When The new password length is less than 8 or larger than 16
    Then I should see "Password Must Be Between 8 And 16 Characters Long"

    When The "new password" does not match "confirm new password"
    Then I should see "Confirm Password Does Not Match New Password"

    When I give a valid admin email
    Then I should see  "A Reset Link Has Been Sent To Your Phone, The Link Expires In One Hour"
    And I should recieve a text message with a link to the password reset page

    When I fill out the Partner Password Reset form correctly
    Then I should be redirected to the login page

    When I log in with the new password
    Then I should be allowed access to the partner dashboard

Feature: Admin Dashboard page
  Scenario: Confirming displayed data
    Given I am on "admin"
    Then I should see an positive whole number under "Partners Logged In Today" and "Admins Logged In Today"

    When I go to "Partner Orders"
    Then I should see that the number of non-closed, non-discarded partner orders matches that of the dashboard

    When I go to "Material Requests"
    Then I should see that the number of unresolved requests matches that of the dashboard

    When I go to "Products"
    Then I should see the data from the inventory table matches that of the products table

  Scenario: Clicking box buttons
    Given I am on "admin"
    When I click on "Partner Orders"
    Then I should be redirected to "Order Control"

    When I click on "Material Requests"
    Then I should be redirected to "Material Requests"

    When I click on "Partners"
    Then I should be redirected to "Partners"

    When I click on "Admins"
    Then I should be redirected to "Admin Accounts"

    When I click on "Products"
    Then I should be redirected to "Product Control"

Feature: Admin Accounts
  Scenario: Create admin account
    Given I am on "admin/account-manager"
    When I click "Add Admin"
    Then I should see the "Create Admin" form modal

    When I fill email value with an email of another admin
    Then I should see "Email Is Already Being Used"

    When I leave a field empty
    Then I should see "### Cannot Be Empty"

    When I fill out and submit the form with a unique email
    Then I should see "Admin Created!"
    And I should see the new admin on the admin's table
    And I should receive an email with a randomly generated password
    And I should receive and email with a password reset link that expires in a day

    When I go to "admin/login"
    Then I should be able to login with the randomly generated password

    When I click the password reset link in the "Password Reset" email
    Then I should be redirected to the password reset page
    And I should be able to reset the password

  Scenario: View and edit
    Given I am on "admin/account-manager"
    When I click on "View" on a admin member row
    Then I should see the "Admin Information" form

    When I change form details and submit changes
    Then I should see "Account Info Updated"

    When I leave a field empty
    Then I should see "### Cannot Be Empty"

    When I replace email with an email of another admin
    Then I should see "Email Is Already Being Used"

  Scenario: Reset admin password
    Given I am on "admin/account-manager"
    When I click "View" on an admin
    And I click "Reset Password"
    Then Admin should receive an email with a reset link that expires in an hour

  Scenario: Delete admin
    Given I am on "admin/account-manager"
    When I click "View" on an admin
    And I click "Delete Admin"
    And I click "Ok"
    Then The admin should not be seen in the admins table

    # See Feature: partner order
    When I click "Delete Admin" on a partner that is involved with an order that is not status closed
    Then I should see "Admin is currently associated with partner order id: ##"

  Scenario: Delete your account
    Given I am on "admin/account-manager"
    When I click on "View" on my account
    And I click "Delete Admin"
    And I click "Ok"
    Then I should see "An Admin Cannot Delete Themself"

Feature: Admin dashboard settings
  Scenario: Editing account details
    Given I am on "admin/settings"
    When I replace email with an email of another admin
    Then I should see "Email Is Already Being Used"

    When I edit account details with an emtpy field
    Then I should see "### Cannot Be Empty"

  Scenario: Password reset
    Given I am on "admin/settings"
    When I use an incorrect old password
    Then I should see "Old Password Is Incorrect"

    When The new password length is less than 8 or larger than 16
    Then I should see "Password Must Be Between 8 And 16 Characters Long"

    When The "new password" does not match "confirm new password"
    Then I should see "Confirm Password Does Not Match New Password"

Feature: Office Control
  Scenario: Create new office
    Given I am on "admin/offices"
    When I click "Add Office"

    When I leave a field empty
    Then I should see "### Cannot Be Empty"

    When I fill out the form
    And I click "Add"
    Then I should see "Office Created!"
    And I should see the new office in the office table

  Scenario: View and edit office
    Given I am on "admin/offices"
    When I click "View" on an office row

    When I leave a field empty
    Then I should see "### Cannot Be Empty"

    When I change office details
    And I submit my changes
    Then I should see "Office Info Updated!"

  Scenario: Delete office
    Given I am on "admin/offices"
    When I click "View" on an office row
    And I click "Delete Office"
    And I click "Ok"
    Then I should not see the deleted office in the offices adminsTable

    When I click "Delete Office" on a office that contains a partner or admin
    Then I should see "#### is still assigned to this office"

Feature: Partner account manager
  Scenario: Run both partner and admin account on one machine
    Given I have an admin and partner account credentials
    When I run open one of partner or admin account on incognito
    Then I should be able to access both accounts at the same time

  Scenario: Create partner
    Given I am on "admin/partners"
    When I click on "Add Partner"
    And I fill out the form correctly
    Then I should see "Application Complete!"
    And The page should refresh
    And I should see the new partner in the partners table

  Scenario: Edit and view partner info
    Given I am on "admin/partners"
    When I click "View" on a partner row
    And I change partner details
    And I submit my changes
    Then I should see "Partner Info Updated!"

  Scenario: Reset partner password
    Given I am on "admin/partners"
    When I click "View" on a partner

    When The partner's status is not active
    And I click "Reset Password"
    Then I should see "Partner Does Not Exist Or Is Not Active"

    When The partner's status is active
    And I click "Reset Password"
    Then Partner should receive a text message with a reset link that expires in an hour

  Scenario: Delete partner
    Given I am on "admin/partner"
    When I click "View" on a partner row
    And I click "Delete Partner"
    And I click "Ok"
    Then I should not see the deleted partner in the partners table

    # See Feature: partner orders
    When I click "Delete Partner" on a partner, that is involved in an order that is not status closed or discarded
    Then I should see "Partner is currently associated with partner order id: ##"

  Scenario: Login attempt with inactive partner
    Given I am on "partner/login"
    When I enter partner credentials
    And I login
    Then I should see "Login Credentials Are Not Valid"

  Scenario: Activating a partner
    Given I am on "partner/login"
    When I click "View" on a partner
    And I change the status to "Active"
    Then The partner should receive a text message with the credentials to access their account

Feature: Product control
  Scenario: Create product
    Given I am on "admin/products"
    And I am an admin
    When I click on "Add Product"
    And I fill out the form using an existing sku
    Then I should see "SKU Is Already Being Used By Another Product"

    When I fill out the form using a unique sku
    Then I should see "Product Created!"
    And I should see the new product in the products table

  Scenario: View product Information
    Given I am on "admin/products"
    And I am an admin
    When I click "View" on a product row
    Then I should see the product's information
    And I should not be able to edit the information

  Scenario: Adding inventory manually
    Given I am on "admin/products"
    And I am an admin
    When I click on "Add"
    Then I should be redirected to "orders"

    When I click "Add Order"
    And I fill out the form
    And I click "View" on the new order
    And I change the status to "closed"
    And I go to "admin/products"
    And I click "View" on the product
    Then I should see the inventory added

  Scenario: Remove inventory
    Given I am on "admin/products"
    And I am an admin
    When I click "View" on a product row
    And I click "Remove"
    And I fill out the "Remove Inventory" form
    Then I should see a decrease in inventory
    And I should see an increase in "out" inventory

  # To add inventory, see Scenario: Create partner order
  Scenario: Deleting product that has inventory > 0
    Given I am on "admin/products"
    And I am an admin
    When I click "View" on a product row
    And I click "Delete Product"
    And I click "Ok"
    Then I should see "### units are still in inventory"

  Scenario: Deleting product that has no inventory
    Given I am on "admin/products"
    And I am an admin
    When I click "View" on a product row
    And I click "Delete Product"
    And I click "Ok"
    Then I should not see the product in the products table

Feature: Partner orders
  Scenario: Create a partner order
    Given I am on "admin/orders"
    And I am an admin
    When I click on "Create Order"
    And I fill out the form
    Then The partner should receive a text message with an easy entry link into the partner dashboard that expires the midnight a day later

  Scenario: View and edit partner order
    Given I am on "admin/orders"
    When I click "View" on a product row
    Then I should be able to see and edit the partner order

    When I change the status to "accepted"
    Then I should not be able to edit details other than status

    When I change the status to "closed"
    Then I should not be able to edit details
    And I should not be able to add a demerit

  Scenario: Print partner order manifest
    Given I am on "admin/orders"
    When I click "Print" on a product row
    Then I should see a modal containing the order data and barcodes

    When I click the "Print" button
    Then I should see the browser print form

  Scenario: Adding demerit
    Given I have an active order
    And I am an admin
    When I click "View" on the order
    And I click "Add demerit"
    And I click "Ok"
    Then I should see a demerit record is added

  Scenario: Changing order status by partner
    Given I am a partner
    And I am on "partner/orders"
    When I click on "Accept" on an order under "Sent Orders"
    Then The partner order should be moved along to "Accepted Orders"
    When I click on "Complete" on an order under "Accepted Orders"
    Then The partner order should be moved along to "Accepted Orders"

Feature: Material requests
  Scenario: Partner requesting materials for an order
    Given I am a partner
    And I am on "partner/orders"
    When I click on "Material Request" on an order under "Accepted Orders" or "Sent Orders"
    Then The "Material Requests" button should be disabled

  Scenario: Admin resolving an unresolved materials request
    Given I am an admin
    And I am on "admin/material-requests"
    When I click on "Resolve"
    Then The "Resolved" link should be disabled
    # "Material Requests" button on partner dashboard should be enabled

Feature: Partner dashboard settings
  Scenario: Editing account details
    Given I am on "partner/settings"
    When I edit account details with an emtpy field
    Then I should see an error message

    When I update form details correctly
    Then I should see "Account Updated!"

  Scenario: Password reset
    Given I am on "partner/settings"
    When I use an incorrect old password
    Then I should see "Old Password Is Incorrect"

    When The new password length is less than 8 or larger than 16
    Then I should see "Password Must Be Between 8 And 16 Characters Long"

    When The "new password" does not match "confirm new password"
    Then I should see "Confirm Password Does Not Match New Password"
