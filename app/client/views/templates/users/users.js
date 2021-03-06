Template.users.onCreated(function(){});

Template.users.onRendered(function() {
	$('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green'
    });

    var table = this.data.dataTable;
	$(document).ready(function(){
		$('#users-table tbody').on( 'click', 'tr', function (event) {
			var rowData = table.row(this).data();
			userEdit.loadForm(rowData._id);
		});
	});
});

Template.users.onDestroyed(function(){});

Template.users.helpers({
	imagesCollection: function() {
		return {collection: 'Images'};
	},
	groups: function() {
		return [{
			text: T9n.get('groupMD'),
			value: "medical_doctor"
		},{
			text: T9n.get('groupNurse'),
			value: "nurse"
		},{
			text: T9n.get('groupReception'),
			value: "recepcionist"
		},{
			text: T9n.get('groupAdmin'),
			value: "administration"
		}]
	},
	users: function () {
		return Meteor.users.find();
	},
	reactiveDataFunction: function () {
		return function () {
			return Meteor.users.find().fetch();
		};
	},
	optionsObject: {
		columns: [{
			title: '',
			//width: '1%',
			data: 'profile.picture',
			orderable: false,
			render: function(cellData, renderType, currentRow) {
				var url = 'https://cdn4.iconfinder.com/data/icons/medical-14/512/9-128.png';
				if(cellData){
					var image = Images.findOne({'_id': cellData});
					if(image) {
						url = image.link();
					}
				} else {
					var email = currentRow.emails[0].address;
					url = Gravatar.imageUrl(email, {
						secure: true,
						size: 28,
						default: url
					});
				}
				return '<img class="profile-pic" src="' + url + '">';
			}
		},{
			title: T9n.get('name'),
			data: 'profile.firstName',
			render: function(cellData, renderType, currentRow) {
				return currentRow.profile.firstName + ' ' + currentRow.profile.lastName;
			}
		},{
			title: 'Email',
			data: 'emails[0].address',
			render: function(cellData, renderType, currentRow) {
				return '<i class="fa fa-envelope"></i>&nbsp;' + currentRow.emails[0].address;
			}
		},{
			title: T9n.get('enabled'),
			//width: '1%',
			orderable: false,
			data: 'isUserEnabled',
			render: function(cellData, renderType, currentRow) {
				// var checkbox = '<input type="checkbox" class="js-switch"'; #TODO: editar direto na tabela
				// checkbox += (currentRow.isUserEnabled) ? ' checked' : '';
				// checkbox += '/>';
				// return checkbox;
				var html = '<span class="label label-';
				html += (cellData) ? 'primary' : 'danger';
				html += '">';
				html += (cellData) ? T9n.get('enabled') : T9n.get('disabled');
				return html;
			}
		},{
			title: T9n.get('superAdmin'),
			//width: '1%',
			orderable: false,
			data: 'isSuperAdmin',
			render: function(cellData, renderType, currentRow) {
				// var checkbox = '<input type="checkbox" class="js-switch"'; #TODO: editar direto na tabela
				// checkbox += (currentRow.isUserEnabled) ? ' checked' : '';
				// checkbox += '/>';
				// return checkbox;
				var html = '<span class="label label-';
				html += (cellData) ? 'primary' : 'danger';
				html += '">';
				html += (cellData) ? T9n.get('enabled') : T9n.get('disabled');
				return html;
			}
		},{
			//title: T9n.get('edit'),
			//width: '1%',
			data: '_id',
			render: function(cellData, renderType, currentRow) {
				return '<button class="btn btn-info"><i class="glyphicon glyphicon-edit user-id" aria-hidden="true" data-userid="' + cellData + '"></i></button>';
			}
		}]
	}
});

var userEdit = (function(){
	var form = null;
	var picture = null;
	var firstName = null;
	var lastName = null;
	var email = null;
	var password = null;
	var group = null;
	var enabled = null;
	var superAdmin = null;
	var save = null;

	var _findElements = function() {
		form = $('form#user-form');
		picture = form.find('input[collection=Images]');
		firstName = form.find('input[name=firstName]');
		lastName = form.find('input[name=lastName]');
		email = form.find('input[name=email]');
		password = form.find('input[name=password]');
		group = form.find('select[name=group]');
		enabled = form.find('input[name=enabled]');
		superAdmin = form.find('input[name=super-admin]');
		save = form.find('button[type=submit]');
	};

	var _prepareForm = function(userId) {
		if(Meteor.Device.isPhone()) {
			$('#formbox').css('display', 'none');
			var formModal = $(`<div class="modal-dialog fullscreen" tabindex="-1" role="dialog" aria-hidden="true">
				<div class="modal-content animated bounceInRight">
					<div class="modal-header">` + TAPi18n.__('users_edituser') + `
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					</div>
					<div class="modal-body"></div>
					<!--div class="modal-footer">
						<button class="btn" data-dismiss="modal">Close</button>
					</div-->
				</div>
			</div>`);

			$('body').prepend(formModal);
			$('.fullscreen').modal();
		 	$('#user-form').detach().appendTo('.fullscreen .modal-body');
		 	$('body').css('position', 'relative');
		    $('.fullscreen').on('hidden.bs.modal', function(){
		    	$('#user-form').detach().appendTo('#formbox');
		    	$('.fullscreen').remove();
			});
			$('.cancel').click(function(){
				userEdit.hideForm();
			});
			_findElements();
		}
		else {
			if($('#formbox').hasClass('col-sm-0')){
				$('#tablebox').toggleClass('col-sm-12 col-sm-8');
				$('#formbox').toggleClass('col-sm-0 col-sm-4');
				_findElements();
			}
		}
		if(userId){
			password.attr('required', false);
		}
		else {
			password.attr('required', true);
			form[0].reset();
		}
		form.off('submit');
		form.submit(function(event) {
			var newPassword = null;
			if(password.val().trim().length > 0) {
				newPassword = password.val().trim();
			}
			Meteor.call('updateUser', userId, newPassword, {
				"emails.0.address": email.val(),
				"profile.picture": picture.val(),
				"profile.firstName": firstName.val(),
				"profile.lastName": lastName.val(),
				"profile.group": group.val(),
				"profile.language":TAPi18n.getLanguage(),
				"isUserEnabled": enabled.prop('checked'),
				"isSuperAdmin": superAdmin.prop('checked')
			}, function(error, result){
				if (error) {
					toastr['error'](error.message, TAPi18n.__('common_error'));
				}
				if (result) {
					toastr['success'](result, TAPi18n.__('common_success'));
					_clearForm();
					_hideForm();
				}
			});
			event.preventDefault();
		});
	};

	var _clearForm = function() {
		Template.forEachCurrentlyRenderedInstance(function(template, index, templateArr){
			if(template.fileId){
				template.fileId.set(false);
			}
		});
		picture.val(''),
		firstName.val('');
		lastName.val('');
		email.val('');
		password.val('');
		enabled.iCheck('uncheck');
		superAdmin.iCheck('uncheck');
		form.off('submit');
	};

	var _hideForm = function() {
		if(Meteor.Device.isPhone()) {
			$('.fullscreen').modal('hide');
		}
		else {
			if($('#formbox').hasClass('col-sm-4')){
				$('#tablebox').toggleClass('col-sm-8 col-sm-12');
				$('#formbox').toggleClass('col-sm-4 col-sm-0');
			}
		}
	}

	return {
		loadForm(userId) {
			_prepareForm(userId);
			if(userId){
				var user = Meteor.users.findOne({_id: userId});
				firstName.val(user.profile.firstName);
				lastName.val(user.profile.lastName);
				email.val(user.emails[0].address);
				password.attr('placeholder', TAPi18n.__('users_changepassword'));

				//#TODO: use profiles.group or Roles
				//var userRoles = Roles.getRolesForUser(userId);
				// if($.inArray('medical_doctor', userRoles) >= 0){
				// 	group.val('medical_doctor');
				// } else if($.inArray('nurse', userRoles) >= 0){
				// 	group.val('nurse');
				// } else if($.inArray('recepcionist', userRoles) >= 0){
				// 	group.val('recepcionist');
				// } else if($.inArray('administration', userRoles) >= 0){
				// 	group.val('administration');
				// }
				group.val(user.profile.group);

				if (user.isUserEnabled) {
					enabled.iCheck('check');
				}
				else {
					enabled.iCheck('uncheck');
				}

				if (user.isSuperAdmin) {
					superAdmin.iCheck('check');
				}
				else {
					superAdmin.iCheck('uncheck');
				}

				Template.forEachCurrentlyRenderedInstance(function(template, index, templateArr){
					if(template.fileId){
						template.fileId.set(user.profile.picture);
					}
				});
			}
		},
		hideForm: function() {
			_hideForm();
		}
	}
})();


Template.users.events({
	'click .user-id': (event, template) => {
		var userId = event.currentTarget.dataset.userid;
		userEdit.loadForm(userId);
	},
	'click .new-user': (event, template) => {
		userEdit.loadForm(null);
	},
	'click .cancel': (event, template) => {
		userEdit.hideForm();
	}
});