/**
 * @desc gulp help 输出相关帮助;
 * @author Aaron(rongzhong.sun@imike.com)'
 * npm install gulp gulp-if gulp-rev-all gulp-image browser-sync  gulp-useref gulp-filter gulp-uglify gulp-clean moment gulp-replace gulp-sequence gulp-minify-html gulp-minify-css gulp-zip -g
 */
var gulp = require('gulp');
var gulpif = require('gulp-if');
var RevAll = require('gulp-rev-all');
var useref = require('gulp-useref');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var moment = require('moment');
var replace = require('gulp-replace');
var sequence = require('gulp-sequence');
var minifyHtml = require("gulp-minify-html");
var minifyCss = require('gulp-minify-css');
var zip = require('gulp-zip');
var config = require('./gulpconfig.json');
var browserSync = require('browser-sync').create();
var image = require('gulp-image');
// var sftp = require('gulp-sftp')

gulp.task("default", function () {
    gulp.start(['help']);
});

gulp.task("help", function () {
    console.log("");
    console.log('    gulp 模式:')
    console.log('     dev       -- 开发模式');
    console.log('     smlt      -- 打包模拟环境');
    console.log('     product   -- 打包生产环境');
    console.log("");
    console.log("");
    console.log('    *** smlt/product 模式 会打包main_smlt/main_product加时间戳的zip包');
    console.log('    *** 资源自动化配置在根目录/gulpconfig.json');
    console.log("");
});
 
//默认 task
gulp.task('dev', ['clean'], function () {
    config.startTime = moment().format('YYYY-MM-DD hh:mm:ss');
    console.log("=====>    开始构建 【开发环境】 @ ", config.startTime);
    config.mode = 'src';
    return gulp.start(['main', 'exe_config']);
});

//生产 task build
gulp.task('product', function (cb) {
    config.startTime = moment().format('YYYY-MM-DD hh:mm:ss');
    console.log("=====>     开始构建 【生产环境】 @ ", config.startTime);
    config.mode = 'product';
    return sequence('clean', ['exe_config', 'main'], 'zip', cb);
});

//模拟 task build
gulp.task('smlt', function (cb) {
    config.startTime = moment().format('YYYY-MM-DD hh:mm:ss');
    console.log("=====>     开始构建 【模拟环境】 @ ", config.startTime);
    config.mode = 'smlt';
    return sequence('clean', ['exe_config', 'main'], 'zip', cb);
});

//合并主要资源
gulp.task('main', function () {
    console.log('=====>     开始执行主页面引用合并压缩');
    // var jsFilter = filter('**/*.js', { restore: true });
    // var cssFilter = filter('**/*.css', { restore: true });
    var hmtlFilter = filter('**/*.html', { restore: true });

    var revAll = new RevAll({
        dontRenameFile: ['.html']
    });

    // var assets = useref.assets();
    //default src model
    config.mode = config.mode || "src";

    return gulp.src(['!./src/bower_components/**/*.html', './src/**/*.html'])
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        // .pipe(jsFilter)
        // .pipe(uglify())
        .pipe(gulpif('*.js', replace(config.serviceUrl.bmsinterface.src, config.serviceUrl.bmsinterface[config.mode])))
        .pipe(gulpif('*.js', replace(config.serviceUrl.if.src, config.serviceUrl.if[config.mode])))
        .pipe(gulpif('*.js', replace(config.serviceUrl.ots.src, config.serviceUrl.ots[config.mode])))
        // .pipe(jsFilter.restore)
        // .pipe(cssFilter)
        // .pipe(minifyCss())
        // .pipe(cssFilter.restore)
        // .pipe(assets.restore())
        // .pipe(useref())
        .pipe(revAll.revision())
        .pipe(hmtlFilter)
        .pipe(minifyHtml({
            quotes: true,
            conditionals: true,
            spare: true,
            empty: true
        }))
        .pipe(hmtlFilter.restore)
        .pipe(gulp.dest(config.buildPath));
});

//执行Config
gulp.task('exe_config', function (cb) {
    runTasks(config.actions, cb);
});

//清空
gulp.task("clean", function () {
    console.info("=====>    清空原构建目录");
    return gulp.src("build", { read: false })
        .pipe(clean());
});

//打包
gulp.task('zip', function () {
    var timeStr = moment().format('YYYYMMDDHHmmss');
    var pre = '';
    if (config.mode == 'smlt') {
        pre = 'smlt-h5.imike.cn'
    } else if (config.mode == 'product') {
        pre = 'h5.imike.com'
    }
    var zipName = pre + '_' + timeStr + ".zip";
    console.log("=====>     正在打包文件 【%s】 ", zipName);
    return gulp.src('build/**')
        .pipe(zip(zipName))
        .pipe(gulp.dest('./'));
});        



// 起个web server玩玩
gulp.task('server', function () {
    browserSync.init({
        server: {
            baseDir: "./src",
            index: "index.html"
        }
    });

    gulp.watch(["./src/**/*"]).on("change", browserSync.reload);
});

// 
// gulp.task('upload', function () {
//     return gulp.src(['./smlt-h5.imike.cn_20151224112357.zip'])
//         .pipe(sftp({
//             host: '10.10.147.187',
//             port: 22,
//             user: 'sunrongzhong ',
//             // pass: 'tJY9hbhc3CUKzq',
//             key:'~/.ssh/id_dsa_1024',
//             remotePath: '/data/app/tomcat-h5/webapps'
//         }));
// })


//基于config 执行所有行为
function runTasks(actions, cb) {
    var actionCount = actions.length;
    var doneCount = 0;
    console.log("=====>     开始执行Config配置 共 %d 项", actionCount);

    for (var index = 0; index < actionCount; index++) {

        var action = actions[index];
        gulp.src(action.src)
            .pipe(gulpif(action.code.indexOf("uglify") > -1, uglify()))
            .pipe(gulpif(action.code.indexOf("minifyHtml") > -1, minifyHtml()))
            .pipe(gulpif(action.code.indexOf("minifyCss") > -1, minifyCss()))
            .pipe(gulpif(action.code.indexOf("opimage") > -1, image()))
            .pipe(gulp.dest(config.buildPath + action.dest))
            .on('finish', function (index) {
                var idx = index
                return function () {
                    doneCount++;
                    console.log("=====>      执行Config配置 第 %d 项 已完成 %d in %d", idx + 1, doneCount, actionCount);
                    if (doneCount == actionCount) {
                        cb();
                    }
                };
            } (index));
    }
}

