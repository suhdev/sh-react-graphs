var gulp = require('gulp'),
    sass = require('gulp-sass'); 

gulp.task('sass',()=>{
    return gulp.src(['./sass/*.scss'])
        .pipe(sass({
            outputStyle:'compressed'
        }))
        .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch',['sass'],()=>{
    return gulp.watch(['./sass/*.scss','./sass/**/*.scss'],['sass']);
}); 