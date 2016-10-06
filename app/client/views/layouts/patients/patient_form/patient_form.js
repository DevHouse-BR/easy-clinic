import '/imports/client/datepicker/bootstrap-datepicker.js';
import '/imports/client/datepicker/bootstrap-datepicker.pt-BR.min.js';
import '/imports/client/datepicker/bootstrap-datepicker.es.min.js';
import '/imports/client/datepicker/datepicker3.css';

/*****************************************************************************/
/* PatientForm: Event Handlers */
/*****************************************************************************/
Template.patientForm.events({
});

/*****************************************************************************/
/* PatientForm: Helpers */
/*****************************************************************************/
Template.patientForm.helpers({
});

/*****************************************************************************/
/* PatientForm: Lifecycle Hooks */
/*****************************************************************************/
Template.patientForm.onCreated(function () {
});

Template.patientForm.onRendered(function () {
	$('input[name=createdAt], input[name=dateOfBirth]')
		.wrap('<div class="input-group date"></div>')
		.after('<span class="input-group-addon"><i class="fa fa-calendar"></i></span>');

	$('.input-group.date').datepicker({
		format: "dd/mm/yyyy",
		language: TAPi18n.getLanguage(),
		autoclose: true,
		todayHighlight: true
	});

	$('textarea[name=obs]')
		.css('display', 'block')
		.css('width', '100%')
		.parent()
			.css('display', 'block')
		.find('label')
			.css('display', 'inline-block')
			.css('max-width', '100%')
			.css('margin-bottom', '5px');
});

Template.patientForm.onDestroyed(function () {
});
