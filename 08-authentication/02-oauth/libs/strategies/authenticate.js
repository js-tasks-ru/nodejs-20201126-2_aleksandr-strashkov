const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }
  try {
    let user = await User.findOne({email});

    if (!user) {
      user = new User({email, displayName});
      await user.save();
    }
    done(null, user);
  } catch (err) {
    done(err, false, err.message);
  }
};
