Schedule = new Mongo.Collection('schedule');

scheduleSchema = {
  resourceId: {
    type: String
  },
  constraint: {
    type: String
  },
  start: {
    type: Date,
  },
  end: {
    type: Date,
  },
  title: {
    type: String
  },
  patient: {
    type: String,
    optional: true
  },
  status: {
    type: String
  },
  // notifiedAt: {
  //   type: Date,
  //   optional: true
  // }
  notified: {
    type: Boolean,
    optional: true
  }
};

Schedule.attachSchema(new SimpleSchema(scheduleSchema));

if (Meteor.isServer) {
  Schedule.allow({
    insert: function (userId, doc) {
      var storedEvents = Schedule.find({
          resourceId: doc.resourceId,
          start: {
              $gte: doc.start
          },
          end: {
              $lte: doc.end
          }
      }).fetch();
      return (storedEvents.length == 0);
    },

    update: function (userId, doc, fieldNames, modifier) {
      return true;
    },

    remove: function (userId, doc) {
      return true;
    }
  });
}