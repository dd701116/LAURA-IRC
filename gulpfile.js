var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    uglify = require('gulp-uglify-es').default,
    cleanCSS = require('gulp-clean-css'),
    useref = require('gulp-useref');

function build_directive() {

    // build sequence
    return gulp.src('directive/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/directive'));
}
function build_lib() {

    // build sequence
    return gulp.src('lib/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('build/lib'));
}

function build_index() {

    // build sequence
    return gulp.src('index.js')
        .pipe(uglify())
        .pipe(gulp.dest('build'));
}

function build_style() {

    // build sequence
    return gulp.src('css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('build/css'));
}

function build_html() {

    // build sequence
    return gulp.src('section/*.html')
        .pipe(gulp.dest('build/section'));
}

function watch() {

    livereload.listen();

    gulp.watch("directive/**/*.js",build_directive).on('change',function (e) {
        console.log("[watch] change : " + e.path);
    });
    gulp.watch("lib/*.js",build_lib).on('change',function (e) {
        console.log("[watch] change : " + e.path);
    });
    gulp.watch("css/*.css",build_style).on('change',function (e) {
        console.log("[watch] change : " + e.path);
    });

    gulp.watch(['*.html','*.js','directive/**/*.js','lib/*.js']).on('change',function (e) {
        livereload.changed(e);
    });

    return true;
}

gulp.task('build_directive', build_directive);

gulp.task('build_lib', build_lib);

gulp.task('build_style', build_style);

gulp.task('build_html', build_html);

gulp.task('build', gulp.series(build_directive, build_lib, build_index, build_style, build_html, function () {
    // build sequence
    return gulp.src('index.html').pipe(gulp.dest('build'));
}));

gulp.task('deploy', gulp.series(build_directive, build_lib, build_index, build_style, build_html, function () {

    // deploy sequence
    gulp.src('index.html').pipe(gulp.dest('build'));
    gulp.src('build/section/*.html').pipe(gulp.dest('deploy/section'));
    return gulp.src('build/*.html')
        .pipe(useref())
        .pipe(gulp.dest('deploy'));
}));

gulp.task('watch', watch);

gulp.task('default', function () {

    console.log("Hi bro !");

    return true;
});