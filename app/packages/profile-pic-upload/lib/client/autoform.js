AutoForm.addInputType("profilePicUpload", {
  template: "picFileUpload",
  valueIn: function (value, attributes) {
    if(!value){
    	$('[data-reset-file]').click();
    }
    return value;
  },
});

// AutoForm._globalHooks.onSuccess.push(function (type) {
//   if (type === 'insert') {
//     try {
//       if (this.template) {
//         this.template.$('[data-reset-file]').click();
//       }
//     } catch (e) {}
//   }
// });

SimpleSchema.messages({
  uploadError: '[value]'
});
