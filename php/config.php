<?php
session_start();

include 'secrets.php';
/**
 * PHP backend code folders
 *
 *
 */
$GLOBALS['folders'] =  [
  'Providers',
  'Controllers',
  'Utilities'
];
/**
 * List of routes to dependency autoloads
 *
 *
 */
$GLOBALS['dep'] =  [
];
/**
 * DB config
 *
 * @var [type]
 */
$GLOBALS['error_reporting'] = false;
$GLOBALS['timezone'] =  'America/New_York';
/**
 * Router values
 *
 */
$GLOBALS['allowed_hostnames'] =  [
  "http://localhost:4000",
];

$GLOBALS['Access_Control_Allow_Credentials'] =  "true";
$GLOBALS['auth_groups'] =  [
  [
    'auth_ref' => 'public',
    'condition' => true,
  ],
  [
    'auth_ref' => 'admin',
    'condition' => isset($_SESSION['admin_id']),
  ],
  [
    'auth_ref' => 'partner',
    'condition' => isset($_SESSION['partner_id']),
  ],
];
$GLOBALS['routes'] =  [
    [
        'type' => 'api',
        'route' => '/api/partner/partnerApply',
        'callback' => 'Partners::insertPartner',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/adminLogin',
        'callback' => 'Session::adminLogin',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/sessionExists',
        'callback' => 'Session::sessionExists',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/getOffices',
        'callback' => 'Offices::readOffices',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/logout',
        'callback' => 'Session::logout',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getPartners',
        'callback' => 'Partners::readPartners',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/updatePartnerInfo',
        'callback' => 'Partners::updatePartner',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getAccountDetails',
        'callback' => 'Admins::getAccountDetails',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/updateAccountDetails',
        'callback' => 'Admins::updateAccountDetails',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/updateAdminPassword',
        'callback' => 'Admins::updateAdminPassword',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/updateAdminInfo',
        'callback' => 'Admins::updateAdminInfo',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getAdmins',
        'callback' => 'Admins::readAdmins',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/addAdmin',
        'callback' => 'Admins::addAdmin',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/deleteAdmin',
        'callback' => 'Admins::deleteAdmin',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/resetAdminPassword',
        'callback' => 'Admins::resetAdminPassword',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/adminForgotPasswordRequest',
        'callback' => 'Admins::forgotPassword',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/updateOfficeDetails',
        'callback' => 'Offices::updateOfficeDetails',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/deleteOffice',
        'callback' => 'Offices::deleteOffice',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/addOfficeRequest',
        'callback' => 'Offices::createOffice',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/resetPartnerPassword',
        'callback' => 'Partners::resetPartnerPassword',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/deletePartner',
        'callback' => 'Partners::deletePartner',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getProducts',
        'callback' => 'Products::readProducts',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/deleteProduct',
        'callback' => 'Products::deleteProduct',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/addProductRequest',
        'callback' => 'Products::createProduct',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getPartnerOrders',
        'callback' => 'PartnerOrders::readPartnerOrders',
        'auth' => ['partner', 'admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/addPartnerOrder',
        'callback' => 'PartnerOrders::createPartnerOrder',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/updatePartnerOrderDetails',
        'callback' => 'PartnerOrders::updatePartnerOrder',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/addDemerit',
        'callback' => 'PartnerDemerits::createPartnerDemerits',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getProductInventory',
        'callback' => 'Inventory::readProductInventory',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/removeInventory',
        'callback' => 'InventoryControl::removeInventory',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getMaterialRequests',
        'callback' => 'Materials::readMaterialRequests',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/resolveMaterialRequest',
        'callback' => 'Materials::resolveMaterialRequest',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/partnerLogin',
        'callback' => 'Session::partnerLogin',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/partner/updatePartnerOrderStatus',
        'callback' => 'PartnerOrders::updatePartnerOrderStatus',
        'auth' => ['partner'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/partner/requestPartnerOrderMaterials',
        'callback' => 'Materials::requestPartnerOrderMaterials',
        'auth' => ['partner'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/partner/getAccountDetails',
        'callback' => 'Partners::getAccountDetails',
        'auth' => ['partner'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/partner/updateAccountDetails',
        'callback' => 'Partners::updateAccountDetails',
        'auth' => ['partner'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/partner/updatePassword',
        'callback' => 'Partners::updatePassword',
        'auth' => ['partner'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/validateAdminPasswordToken',
        'callback' => 'Admins::validatePasswordToken',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/adminPasswordReset',
        'callback' => 'Admins::passwordReset',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/validatePartnerPasswordToken',
        'callback' => 'Partners::validatePasswordToken',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/partner/partnerPasswordReset',
        'callback' => 'Partners::passwordReset',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/partner/partnerForgotPasswordRequest',
        'callback' => 'Partners::forgotPassword',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'api',
        'route' => '/api/public/validatePartnerToken',
        'callback' => 'Session::partnerTokenEntry',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'POST'
    ],
    [
        'type' => 'view',
        'route' => '/api/public/testplan',
        'filename' => 'testplan.feature',
        'auth' => ['public'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/getDashData',
        'callback' => 'AdminDashboard::readDashboardData',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'GET'
    ],
    [
        'type' => 'api',
        'route' => '/api/admin/updateSettings',
        'callback' => 'Admins::updateSettings',
        'auth' => ['admin'],
        'REQUEST_METHOD' => 'POST'
    ],
];

/**
 * Functions to run before App runs
 *
 */
if($_SERVER['SERVER_NAME'] === "localhost"){
    $_SERVER['REQUEST_URI'] = str_replace("ascms/", "", $_SERVER['REQUEST_URI']);
}