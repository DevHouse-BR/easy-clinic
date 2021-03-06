Template.documentModelForm.events({
	'click .new-record': function (event, template) {
		FlowRouter.go('documentModelCreate');
	}
});

Template.documentModelForm.helpers({
	saveButton: function () {
		return Spacebars.SafeString('<i class="fa fa-floppy-o" aria-hidden="true"></i> ' + TAPi18n.__('common_save'));
	},
	isEditForm: function() {
		return (FlowRouter.getParam('_id')) ? true : false;
	},
	record: function() {
		var docModel = DocumentModels.findOne({_id: FlowRouter.getParam('_id')});
		Template.instance().data.document_model = docModel;
		return docModel;
	}
});

Template.documentModelForm.onCreated(function () {
	AutoForm.addHooks('documentModelForm', {
		onSuccess: function(formType, result) {
			toastr['success'](TAPi18n.__('common_save-success'), TAPi18n.__('common_success'));
			FlowRouter.go('documentModelList');
		},
		onError: function(formType, error) {
			toastr['error'](error.message, TAPi18n.__('common_error'));
		}
	});
});

Template.documentModelForm.onRendered(function () {

	var data = this.data;
	$(document).ready(function(){
		var saveButton = $('.document-model-form button[type=submit]');
		var submitParent = saveButton.parent();
		submitParent.addClass('text-right');
		submitParent.detach().appendTo('#table-footer');
		saveButton.click(function(){
			$('.document-model-form').submit();
		});

		var cancelBtn = $.parseHTML(`<button type="button" class="btn btn-white cancel" data-dismiss="modal">
										<i class="fa fa-ban" aria-hidden="true"></i> ${TAPi18n.__('common_cancel')}
									</button>`);
		$(cancelBtn).prependTo(submitParent);

		$(cancelBtn).click(function(){
			FlowRouter.go('documentModelList');
		});

		$("select[name=type]").chosenIcon({
			disable_search_threshold: 10
		});

		if(data.prescription) {
			var deleteBtn = $.parseHTML('<button class="btn btn-danger delete-btn" type="button"><i class="fa fa-trash" aria-hidden="true"></i></button>');
			$(deleteBtn).prependTo(submitParent);
			$(deleteBtn).click(function(event){
				swal({
					title: TAPi18n.__('common_areYouSure'),
					text: TAPi18n.__('patients_deleteConfirmation', data.document_model.name),
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#ed5565",
					confirmButtonText: TAPi18n.__('common_confirm')
				}, function(){
					Receituario.remove(data.document_model._id, function (error, result) {
						if (error) {
							toastr['error'](error.message, TAPi18n.__('common_error'));
						} 
						else {
							toastr['success'](TAPi18n.__('common_deleteSuccess'), TAPi18n.__('common_success'));
						}
					});
					FlowRouter.go('documentModelList');
				});
			});
		}

		var drugs = localDrugs.find({}, {fields: {'name':1, _id: 0}}).fetch();

		var drugsArray = $.map(drugs, function(value, index) {
			return [value.name];
		});

		var diseases = localICD10.find({}, {fields: {'icd':1, _id: 0}}).fetch();

		var diseasesArray = $.map(diseases, function(value, index) {
			return [value.icd];
		});

		$("textarea[name=model]").summernote({
			height: 300,
			placeholder: TAPi18n.__('document-models_model-placeholder'),
			print: {
				stylesheetUrl: Meteor.absoluteUrl() + 'css/summernote-print.css'
			},
			lang: TAPi18n.getLanguage(),
			fontSizes: ['4', '6', '8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '36'],
			lineHeights: ['0.4', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '1.6', '1.8', '2.0', '3.0'],
			toolbar: [
				['history', ['undo', 'redo']],
				['style', ['style', 'bold', 'italic', 'underline', 'clear']],
				['font', ['strikethrough', 'superscript', 'subscript']],
				['fontsize', ['fontsize']],
				['para', ['ul', 'ol', 'paragraph']],
				['height', ['height']],
				['insert', ['hr', 'table']],
				['misc', ['fullscreen', 'codeview', 'print']]
			],
			hint: [{
				words: drugsArray,
				//match: /\b(\w{2,})$/,
				match: /\B\$(\w*)$/,
				search: function search(keyword, callback) {
					callback($.map(this.words, function (item) {
						return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0 ? item : null;
					}));
				},
				index: 1,
				replace: function replace(item) {
					return item.toUpperCase() + ' ';
				}
			},{
				words: diseasesArray,
				match: /\B@(\w*)$/,
				search: function search(keyword, callback) {
					callback($.map(this.words, function (item) {
						return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0 ? item : null;
					}));
				},
				index: 2,
				replace: function replace(item) {
					return item.toUpperCase() + ' ';
				}
			},{
				words: [
					'NOME_DO_PACIENTE', 
					'CPF_PACIENTE', 
					'RG_PACIENTE',
					'ENDERECO_PACIENTE',
					'DATA_DA_CONSULTA', 
					'DIA',
					'MES',
					'ANO',
					'HORARIO_DA_CONSULTA', 
					'NOME_PROFISSIONAL',
					'CRM_PROFISSIONAL',
					'ASSINATURA_PROFISSIONAL',
					'ENDERECO_CLINICA'
				],
				match: /\B#(\w*)$/,
				search: function (keyword, callback) {
					callback($.grep(this.words, function (item) {
						//return item.indexOf(keyword) === 0;
						return item.toUpperCase().indexOf(keyword.toUpperCase()) >= 0 ? item : null;
					}));
				},
				template: function (item) {
					return item;
					//var content = emojiUrls[item];
					//return '<img src="' + content + '" width="20" /> :' + item + ':';
				},
				content: function (item) {
					return '#' + item;
				},
				replace: function replace(item) {
					return item.toUpperCase() + ' ';
				}
			}]
		});

	});

});

Template.documentModelForm.onDestroyed(function () {
	$("textarea[name=model]").summernote('destroy');
	AutoForm.resetForm('documentModelForm');
});