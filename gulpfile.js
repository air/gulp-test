var gulp = require('gulp');
// optionals
var bump = require('gulp-bump');
var git = require('gulp-git');

// update package.json version
gulp.task('bump-version', function() {
  return gulp.src('package.json')
    .pipe(bump())
    .pipe(gulp.dest('.'));
});

// commit package.json and push it
// FIXME push is broken
gulp.task('release', ['bump-version'], function() {
  var version = require('./package.json').version;

  return gulp.src('.')
    .pipe(git.commit('released version ' + version))

    .on('end', function(){
      this.pipe(git.push('origin', 'master'))
      .end();
    });
});

// merge master into gh-pages and push it
// FIXME merge fails, seems to happen before checkout is complete
gulp.task('publish', function() {
  var version = require('./package.json').version;

  return gulp.src('.')
    .pipe(git.checkout('gh-pages'))
    .pipe(git.merge('master'))
    .pipe(git.commit('merged master ' + version + ' to gh-pages'))
    .pipe(git.push('origin', 'gh-pages'))
    .pipe(git.checkout('master'))
    .end();
});
