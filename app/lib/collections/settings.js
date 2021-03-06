Settings = new Mongo.Collection('settings');

var schema = {
  // notifications: {
  //   type: String,
  //   label: function() {
  //     return TAPi18n.__('settings_clinic-notifications');
  //   },
  //   autoform: {
  //     placeholder: function() {
  //       return TAPi18n.__('settings_clinic-notifications-placeholder');
  //     }
  //   }
  // },
  workHoursStart: {
    type: String,
    max: 5,
    label: function() {
      return TAPi18n.__('settings_clinic-workhours-start');
    },
  },
  workHoursEnd: {
    type: String,
    max: 5,
    label: function() {
      return TAPi18n.__('settings_clinic-workhours-end');
    },
  },
  address: {
    type: String,
    label: function() {
      return TAPi18n.__('settings_clinic-address');
    },
    autoform: {
      type: 'textarea',
      rows: 6
    }
  },
};

Settings.attachSchema(new SimpleSchema(schema));

if (Meteor.isServer) {
  Settings.allow({
    insert: function (userId, doc) {
      return true;
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}
