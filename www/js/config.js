
App.config(['$routeProvider','$controllerProvider',

  function($routeProvider, $controllerProvider,$location) {

	   App.registerCtrl = $controllerProvider.register;
    $routeProvider.when('/Login', {
		templateUrl: 'templates/login.html',
		controller: 'loginCtrl'
      }).

	   when('/Home', {
		templateUrl: 'templates/home.html',
		controller: 'homeCtrl'

  }).

	 when('/myLeave', {
		templateUrl: 'templates/my-leave.html',
		controller: 'myLeaveCtrl'

      }).

	   when('/leaveApply', {
		templateUrl: 'templates/leave-apply.html',
		controller: 'myLeaveCtrl'

      }).


	    when('/leaveCancellation', {
		templateUrl: 'templates/leave-cancellation.html',
		controller: 'myLeaveCtrl'

      }).

	    when('/leaveEnquiry', {
		templateUrl: 'templates/leave-enquiry.html',
		controller: 'myLeaveCtrl'

	    }).

         when('/leaveEnquiryDetail/:id/:StatusType', {
             templateUrl: 'templates/leave-enquiry-detail.html',
             controller: 'myLeaveCtrl'
         }).

         when('/leaveEnquiryDetail', {
             templateUrl: 'templates/leave-enquiry-detail.html',
             controller: 'myLeaveCtrl'
         }).

	    when('/leaveDetail', {
		templateUrl: 'templates/leave-detail.html',
		controller: 'myLeaveCtrl'
      }).

	    when('/leaveCalendar', {
		templateUrl: 'templates/leave-calendar.html',
		controller: 'myLeaveCtrl'

      }).
	   when('/leaveCalendarDetail', {
		templateUrl: 'templates/leave-calendar-detail.html',
		controller: 'myLeaveCtrl'

      }).
	    when('/leaveLegend', {
		templateUrl: 'templates/leave-legend.html',
		controller: 'myLeaveCtrl'
      }).
	    when('/leavePlan', {
		templateUrl: 'templates/leave-plan.html',
		controller: 'myLeaveCtrl'
      }).

	   when('/leavePlanDetail', {
		templateUrl: 'templates/leave-plan-detail.html',
		controller: 'myLeaveCtrl'
      }).


	   when('/leaveApproval', {
		templateUrl: 'templates/leave-approval.html',
		controller: 'myLeaveCtrl'
      }).

	    when('/leaveAdminApproval', {
		templateUrl: 'templates/leave-admin-approval.html',
		controller: 'myLeaveCtrl'
      }).


	   when('/leaveDelegate', {
		templateUrl: 'templates/leave-delegate.html',
		controller: 'myLeaveCtrl'
      }).



		/*************My profile***********/

		 when('/myProfile', {
			templateUrl: 'templates/my-profile.html',
			controller: 'myProfileCtrl'
      	}).


		when('/profileChangePass', {
			templateUrl: 'templates/profile-change-pass.html',
			controller: 'myProfileCtrl'


		  }).

		  /*************My Claims***********/

	  when('/myClaims', {
			templateUrl: 'templates/my-claims.html',
			controller: 'myClaimCtrl'
      }).

	    /************* claim Over time***********/

	    when('/claimOvertime', {
			templateUrl: 'templates/claim-overtime.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimOvertimeApply', {
			templateUrl: 'templates/claim-overtime-apply.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimOvertimeApplyDetail', {
			templateUrl: 'templates/claim-overtime-apply-detail.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimOvertimeCancellation', {
			templateUrl: 'templates/claim-overtime-cancellation.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimOvertimeDetail', {
			templateUrl: 'templates/claim-overtime-detail.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimOvertimeEnquiry', {
			templateUrl: 'templates/claim-overtime-enquiry.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimOvertimeDelegate', {
			templateUrl: 'templates/claim-overtime-delegate.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimOvertimeApproval', {
			templateUrl: 'templates/claim-overtime-approval.html',
			controller: 'myClaimCtrl'
      }).

		/************* submit saves claims***********/


	   /************* benefit claim***********/

	    when('/claimBenefit', {
			templateUrl: 'templates/claim-benefit.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimBenefitApply', {
			templateUrl: 'templates/claim-benefit-apply.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimBenefitSubmitSavesClaims', {
			templateUrl: 'templates/claim-benefit-submit-saves-claims.html',
			controller: 'myClaimCtrl'
      }).

	    when('/claimBenefitCancellation', {
			templateUrl: 'templates/claim-benefit-cancellation.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimBenefitEnquiry', {
			templateUrl: 'templates/claim-benefit-enquiry.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimBenefitEnquiryView', {
			templateUrl: 'templates/claim-benefit-enquiry-view.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimBenefitCoverage/:id', {
			templateUrl: 'templates/claim-benefit-coverage.html',
			controller: 'myClaimCtrl'
      }).


	    when('/claimBenefitDelegate', {
			templateUrl: 'templates/claim-benefit-delegate.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimBenefitApproval', {
			templateUrl: 'templates/claim-benefit-approval.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimBenefitBatchDetail', {
			templateUrl: 'templates/claim-benefit-batch-detail.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimBenefitDetail', {
			templateUrl: 'templates/claim-benefit-detail.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimBenefitAttach', {
			templateUrl: 'templates/claim-benefit-attach.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimBenefitApplyBenefitsOrReimbursement', {
			templateUrl: 'templates/claim-benefit-apply-benefits-or-reimbursement.html',
			controller: 'myClaimCtrl'
      }).


	    /************* Reimbursement Claim***********/

	    when('/claimReimbursement', {
			templateUrl: 'templates/claim-reimbursement.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimReimbursementApply', {
			templateUrl: 'templates/claim-reimbursement-apply.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimReimbursementSubmitSavesClaims', {
			templateUrl: 'templates/claim-reimbursement-submit-saves-claims.html',
			controller: 'myClaimCtrl'
      }).

	    when('/claimReimbursementCancellation', {
			templateUrl: 'templates/claim-reimbursement-cancellation.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimReimbursementEnquiry', {
			templateUrl: 'templates/claim-reimbursement-enquiry.html',
			controller: 'myClaimCtrl'
      }).
	  when('/claimReimbursementEnquiryView', {
			templateUrl: 'templates/claim-reimbursement-enquiry-view.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimReimbursementCoverage/:id', {
			templateUrl: 'templates/claim-reimbursement-coverage.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimReimbursementDetail', {
			templateUrl: 'templates/claim-reimbursement-detail.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimReimbursementAttach', {
			templateUrl: 'templates/claim-reimbursement-attach.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimReimbursementDelegate', {
			templateUrl: 'templates/claim-reimbursement-delegate.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimReimbursementApproval', {
			templateUrl: 'templates/claim-reimbursement-approval.html',
			controller: 'myClaimCtrl'
      }).

	    when('/claimReimbursementBatchDetail', {
			templateUrl: 'templates/claim-reimbursement-batch-detail.html',
			controller: 'myClaimCtrl'
      }).

	   when('/reimbursementClaimApplyBenefitsOrReimbursement', {
			templateUrl: 'templates/reimbursement-claim-apply-benefits-or-reimbursement.html',
			controller: 'myClaimCtrl'
      }).








	    /************* request For Payment ***********/

	    when('/claimRequestForPayment', {
			templateUrl: 'templates/claim-request-for-payment.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimRequestForPaymentApply', {
			templateUrl: 'templates/claim-request-for-payment-apply.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimRequestForPaymentCancellation', {
			templateUrl: 'templates/claim-request-for-payment-cancellation.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimRequestForPaymentEnquiry', {
			templateUrl: 'templates/claim-request-for-payment-enquiry.html',
			controller: 'myClaimCtrl'
      }).
	    when('/claimRequestForPaymentDelegate', {
			templateUrl: 'templates/claim-request-for-payment-delegate.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimRequestForPaymentApproval', {
			templateUrl: 'templates/claim-request-for-payment-approval.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimRequestForPaymentEnquiryView', {
			templateUrl: 'templates/claim-request-for-payment-enquiry-view.html',
			controller: 'myClaimCtrl'
      }).
	   when('/claimRequestForPaymentDetail', {
			templateUrl: 'templates/claim-request-for-payment-detail.html',
			controller: 'myClaimCtrl'
      }).

	   when('/claimRequestForPaymentAttach', {
			templateUrl: 'templates/claim-request-for-payment-attach.html',
			controller: 'myClaimCtrl'
      }).
	   when('/requestForPaymentApplyBenefitsOrReimbursement', {
			templateUrl: 'templates/request-for-payment-apply-benefits-or-reimbursement.html',
			controller: 'myClaimCtrl'
      }).

    when('/travelRequest', {
      templateUrl: 'templates/claim-travel-request.html',
      controller: 'myClaimCtrl'
    }).

    when('/travelRequestApproval', {
      templateUrl: 'templates/claim-travel-request-approval.html',
      controller: 'myClaimCtrl'
    }).


		    /*************My Claims***********/

	  when('/myPayroll', {
			templateUrl: 'templates/my-payroll.html',
			controller: 'myPayroll'
      }).

	   when('/payrollPayslip', {
			templateUrl: 'templates/payroll-payslip.html',
			controller: 'myPayroll'
      }).
    when('/payrollCP8A', {
      templateUrl: 'templates/payroll-cp8a.html',
      controller: 'myPayroll'
    }).
    when('/payrollPCB2', {
      templateUrl: 'templates/payroll-pcb2.html',
      controller: 'myPayroll'
    }).
    when('/payrollIR8A', {
      templateUrl: 'templates/payroll-ir8a.html',
      controller: 'myPayroll'
    }).
    when('/payrollIR8S', {
      templateUrl: 'templates/payroll-ir8s.html',
      controller: 'myPayroll'
    }).
    when('/payrollAppendix8A', {
      templateUrl: 'templates/payroll-appendix8a.html',
      controller: 'myPayroll'
    }).
    when('/payrollAppendix8B', {
      templateUrl: 'templates/payroll-appendix8b.html',
      controller: 'myPayroll'
    }).
    when('/payrollTaxExemption', {
      templateUrl: 'templates/payroll-tax-exemption.html',
      controller: 'myPayroll'
    }).


	    /*************My TMS***********/

	  when('/myTms', {
			templateUrl: 'templates/my-tms.html',
			controller: 'myTmsCtrl'
      }).

	   when('/tmsRosterEnquiry', {
			templateUrl: 'templates/tms-roster-enquiry.html',
			controller: 'myTmsCtrl'
      }).

	   when('/tmsRosterEnquiryDetail', {
			templateUrl: 'templates/tms-roster-enquiry-detail.html',
			controller: 'myTmsCtrl'
      }).

    when('/tmsClockingsEnquiry', {
      templateUrl: 'templates/tms-clockings-enquiry.html',
      controller: 'myTmsCtrl'
    }).


    when('/tmsClockOnBehalf', {
      templateUrl: 'templates/tms-clock-on-behalf.html',
      controller: 'myTmsCtrl'
    }).


	    when('/tmsMobileMacAddress', {
			templateUrl: 'templates/tms-mobile-mac-address.html',
			controller: 'myTmsCtrl'
      }).

		  //////// order

      otherwise({
		redirectTo: '/Home'
      });

}]);
