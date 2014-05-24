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
gulp.task('release', ['bump-version'], function() {
  var version = require('./package.json').version;

  return gulp.src('.')
    .pipe(git.commit('released version ' + version))
    .on('end', function(){
      this.pipe(git.push('origin', 'master'))
      .end();
    });
});

gulp.task('checkoutPages', function() {
  return gulp.src('.').pipe(git.checkout('gh-pages'));
});
gulp.task('mergeMaster', function() {
  git.merge('master');
});
gulp.task('pushPages', function() {
  var version = require('./package.json').version;
  return gulp.src('.')
    .pipe(git.commit('merged master ' + version + ' to gh-pages'))
    .on('end', function(){
      this.pipe(git.push('origin', 'gh-pages'))
      .end();
    });
});
gulp.task('checkoutMaster', function() {
  return gulp.src('.').pipe(git.checkout('master'));
});

// merge master into gh-pages and push it
gulp.task('publish', ['checkoutPages', 'mergeMaster', 'pushPages', 'checkoutMaster'], function() {
  // no op  
});
