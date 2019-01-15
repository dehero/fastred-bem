//require.context('./locales', false, /\.json$/);

require('fastred');

fastredLibrary(require.context('./modules', false, /\.js$/));

