import gulp from 'gulp';
import path from 'path';
import root from 'app-root-path';
import watch from 'gulp-watch';
import fs from 'fs';



const paths = {
    src: path.join(root.toString(), 'tmp'),
    dist: path.join(root.toString(), 'dist'),
};

const globs = {
    src: `${paths.src}/**/*.{js,ts,jsx,tsx}`,
};

export const some = () => {
    return watch(globs.src, { ignoreInitial: false }, () => {
        fs.rmSync(paths.dist, { recursive: true });

        (
            gulp.src(globs.src)
                .pipe(gulp.dest(paths.dist))
        );
    });
};