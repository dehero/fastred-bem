const path                  = require('path');
const fs                    = require('fs');
const glob                  = require('glob');
const mkdirp				= require('mkdirp');

const webpack               = require('webpack');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const LiveReloadPlugin      = require('webpack-livereload-plugin');
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');
const CleanWebpackPlugin    = require('clean-webpack-plugin');
const DirectoryNamedPlugin  = require('directory-named-webpack-plugin');
const MergePlugin           = require("merge-webpack-plugin");

const loaderUtils           = require("loader-utils");
const SVGSpriter    		= require('svg-sprite');
const revHash               = require('rev-hash');
const temp				    = require('temp').track();

const liveReload            = new LiveReloadPlugin({port: 35729 + Math.floor(Math.random() * 101)});

const blocksPath            = path.resolve(__dirname, 'blocks');

const tempSpritePath        = temp.mkdirSync();

const regExpPathEscape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/* Locale assembly plugin */

function FastredBemLocalePlugin(options) {
    MergePlugin.call(this, options);
}
FastredBemLocalePlugin.prototype = Object.create(MergePlugin.prototype);
FastredBemLocalePlugin.prototype.buildGroup = function(group) {
    var self = this;
    var files = Object.keys(group.sources);
    var result = null;
    files.reverse(); // Locales should be merged in reverse order
    files.forEach(function(file) {
        result = self.options.join(result, group.sources[file])
    });
    group.result = self.options.save(result);
    group.filename = loaderUtils.interpolateName(
        this, group.filetmpl, { content: group.result });
};

/* Block assembly plugin */

function FastredBemWebpackPlugin(options) {
    this.options = options;
};

FastredBemWebpackPlugin.prototype.apply = function(compiler) {
    var options = this.options;
    var mtimes = {};
    var lastFrontendVars = {};

    var storedFrontendVars;

    // var self = this;
    // self.doPrefetch(compiler);
/*
    compiler.plugin("this-compilation", function(compilation) {

        compilation.plugin("optimize-tree", function(chunks, modules, callback) {

            // var async = require('async');
            // self.state = 'building';

            // Object.keys(self.groups).forEach(function(groupName) {
            //     var group = self.group(groupName);
            //     self.buildGroup(group);
            // });

            // async.forEach(chunks, function(chunk, callback) {
            //     async.forEach(chunk.modules.slice(), function(module, callback) {
            //
            //         console.log(module.resource);
            //
            //         // var group = null;
            //         // Object.keys(self.groups).forEach(function(groupName) {
            //         //     var g = self.group(groupName);
            //         //     if(module.resource in g.sources)
            //         //         group = g;
            //         // });
            //         // if( !group ) return callback();
            //         //
            //         // compilation.rebuildModule(module, function(err) {
            //         //     if(err) compilation.errors.push(err);
            //         //     callback();
            //         // });
            //
            //         callback();
            //
            //     }, function(err) {
            //         if(err) return callback(err);
            //         callback();
            //     });
            // }, function(err) {
            //     if(err) return callback(err);
            //     // self.state = 'loading';
            //     callback();
            // });

            chunks.forEach(function(chunk) {
                console.log(chunk.name);
                chunk.forEachModule(function(module) {

                    // List all locale files
                    if (/locales\\.*\.json$/.test(module.resource)) {

                        console.log(module.resource);

                        compilation.rebuildModule(module, function(err) {
                            if(err) compilation.errors.push(err);
                            // callback();
                            return 'test';
                        });
                    }
                //
                //         console.log(module.resource);
                //
                //         // var group = null;
                //         // Object.keys(self.groups).forEach(function(groupName) {
                //         //     var g = self.group(groupName);
                //         //     if(module.resource in g.sources)
                //         //         group = g;
                //         // });
                //         // if( !group ) return callback();
                //         //
                //         // compilation.rebuildModule(module, function(err) {
                //         //     if(err) compilation.errors.push(err);
                //         //     callback();
                //         // });
                //
                //         callback();
                //
                //     }, function(err) {
                //         if(err) return callback(err);
                //         callback();
                //     });
                // }, function(err) {
                //     if(err) return callback(err);
                //     // self.state = 'loading';
                //     callback();
                });
            });

            callback();

        });

        compilation.plugin("additional-assets", function(callback) {
            // Object.keys(self.groups).forEach(function(groupName) {
            //     var group = self.group(groupName);
            //     compilation.assets[group.filename] = new RawSource(group.result);
            // });
            callback();
        });

    });
    */

    compiler.plugin('emit', function(compilation, callback) {
        let blocks = {};
        let templates = {};
        let sprites = {};
        let frontendVars = {};

        // Inspect chunks
        compilation.chunks.forEach(function(chunk) {

            // Save chunk file urls to frontend vars
            if (chunk.name) {
                chunk.files.forEach(function (file) {
                    let ext = path.extname(file).split('.').pop();

                    if (ext) {
                        frontendVars[chunk.name + '__url_' + ext] = options.server.assetsUrl + file;
                    }
                });
            }

            // Get all used blocks
            chunk.forEachModule(function(module) {
                var modulePath = module.resource;
                var pattern = new RegExp('^(?:' + regExpPathEscape(blocksPath) + '|' + regExpPathEscape(options.blocks) + ')[\\\\\\/](.+)[\\\\\\\/](.+)', 'i');

                if (typeof modulePath === 'string') {
                    let match = modulePath.match(pattern);

                    if (Array.isArray(match)) {
                        let parts = match[1].split(/\\|\//);
                        let block = parts.shift();
                        //let folder = parts.join('-');

                        blocks[block] = 1;

                        let assetName = Object.keys(module.assets)[0];

                        if (assetName) {
                            parts = path.basename(modulePath).toLowerCase().split('.');
                            parts.pop();
                            let name = parts.join('-');

                            frontendVars[block + '__url_' + name] = options.server.assetsUrl + assetName;
                        }
                    }
                }
            });
        });

        // Get filenames for all templates, svg symbol sprites, merge frontend vars
        for (let block in blocks) {
            [blocksPath, options.blocks].forEach(function (element) {
                let files;

                files = glob.sync(path.resolve(element, block, '*.pug'));
                files.forEach(function (file) {
                    templates[path.basename(file)] = file;
                });

                files = glob.sync(path.resolve(element, block, 'symbols/*.svg'));
                files.forEach(function (file) {
                    let name = path.basename(file, '.svg');
                    let sprite = sprites[block];
                    if (!sprite) {
                        sprites[block] = sprite = {};
                    }
                    sprite[name] = file;
                });

                files = glob.sync(path.resolve(element, block, '*.json'));
                files.forEach(function (file) {
                    let json;

                    try {
                        json = JSON.parse(fs.readFileSync(file, {encoding: 'utf-8'}));
                    } catch(e) {
                        json = null;
                    }

                    if (json !== null && typeof json === 'object') {
                        for (key in json) {
                            frontendVars[key] = json[key];
                        }
                    }
                });
            });
        }

        // Copy templates
        for (let name in templates) {
            let file = templates[name];
            let stats = fs.statSync(file);
            let mtime = stats.mtime.getTime();

            // Exclude files that were not changed
            if (mtimes[file] !== mtime) {
                let relativeName = path.relative(options.server.assets, path.resolve(options.server.templates, name));
                let source = fs.readFileSync(file, {encoding: 'utf-8'});

                compilation.assets[relativeName] = {
                    source: function() {
                        return source;
                    },
                    size: function() {
                        return source.length;
                    }
                };

                mtimes[file] = mtime
            }
        }

        // Copy locales
        // if (options.locales) {
        //     files = glob.sync(path.resolve(options.locales, '*.json'));
        //     files.forEach(function (file) {
        //         let stats = fs.statSync(file);
        //         let mtime = stats.mtime.getTime();
        //
        //         // Exclude files that were not changed
        //         if (mtimes[file] !== mtime) {
        //             let relativeName = path.relative(options.server.assets, path.resolve(options.server.locales, path.basename(file)));
        //             let source = fs.readFileSync(file, {encoding: 'utf-8'});
        //
        //             compilation.assets[relativeName] = {
        //                 source: function () {
        //                     return source;
        //                 },
        //                 size: function () {
        //                     return source.length;
        //                 }
        //             };
        //
        //             mtimes[file] = mtime
        //         }
        //     });
        // }

        // Create svg symbol sprites
        for (let block in sprites) {
            let sprite = sprites[block];
            let modified = false;
            let frontendVarName = block + '__url_symbols';

            for (let name in sprite) {
                let file = sprite[name];
                let stats = fs.statSync(file);
                let mtime = stats.mtime.getTime();

                if (mtimes[file] != mtime) {
                    modified = true;
                }

                mtimes[file] = mtime;
            }

            frontendVars[frontendVarName] = lastFrontendVars[frontendVarName];

            if (!modified) continue;

            let spriter = new SVGSpriter({
                shape: {
                    id: {
                        separator: '-',
                        generator: ''
                    }
                },
                mode: {
                    symbol: {
                        dest: options.server.assets,
                        sprite: block + '.symbols.svg'
                    }
                }
            });

            for (let name in sprite) {
                let file = sprite[name];

                spriter.add(file, path.basename(file), fs.readFileSync(file, {encoding: 'utf-8'}));
            }

            spriter.compile(function(error, result, data){
                for (let type in result.symbol) {
                    let name = path.basename(result.symbol[type].path);
                    let source = result.symbol[type].contents;

                    name = path.basename(name, path.extname(name)) + '.' + revHash(source) + path.extname(name);

                    compilation.assets[name] = {
                        source: function() {
                            return source;
                        },
                        size: function() {
                            return source.length;
                        }
                    };

                    frontendVars[frontendVarName] = options.server.assetsUrl + name;
                }
            });
        }

        // Set extra frontend vars for server needs
        if (compiler.options.watch) {
            frontendVars['livereload__url_js'] = liveReload.protocol + '://' + liveReload.hostname + ':' + liveReload.port + '/livereload.js';
        }

        storedFrontendVars = JSON.stringify(frontendVars);
        lastFrontendVars = frontendVars;

        // Save frontend vars for server
        let name = path.relative(options.server.assets, options.server.frontendVarFile);

        compilation.assets[name] = {
            source: function() {
                return storedFrontendVars;
            },
            size: function() {
                return storedFrontendVars.length;
            }
        };

        for (const name in compilation.assets) {
            // Patch JavaScript assets to add compiled frontend vars
            if (path.extname(name) == '.js') {
                let source = compilation.assets[name].source();

                source = source.replace('FRONTEND_VARS', storedFrontendVars);

                compilation.assets[name] = {
                    source: function() {
                        return source;
                    },
                    size: function() {
                        return source.length;
                    }
                };
            }

            // Copy locales to app directory also
            if (/^(?!\.).*\.json$/.test(name)) {

                var parts = name.split('.');
                parts.splice(1, 1);

                var relativeName = path.relative(options.server.assets, path.resolve(options.server.locales, parts.join('.')))

                compilation.assets[relativeName] = compilation.assets[name];
            }
        }

        // Say webpack to watch folders including blocks
        compilation.contextDependencies.push(blocksPath);
        compilation.contextDependencies.push(options.blocks);
        if (options.locales) {
            compilation.contextDependencies.push(options.locales);
        }

        // Force live reload
        if (liveReload) {
            liveReload.lastHash = null;
        }

        callback();
    });

    /*
    compiler.plugin("watch-run", function(watching, done) {

        const changedTimes = watching.compiler.watchFileSystem.wfs.watcher.mtimes;

        const changedFiles = Object.keys(changedTimes)
            .map(file => `\n  ${file}`).join("");

        if (changedFiles.length) {
            console.log("New build triggered, files changed:", changedFiles);
        }
        done();
    });
    */

};

/* Configuration builder */

function FastredBemWebpackConfig(options) {
    const resolvePaths = [options.blocks, blocksPath, path.resolve(options.root, 'node_modules')];

    const localePlugin = new FastredBemLocalePlugin({
        group: '[name]',
        sort: true,
        name: '[name].[hash:8].[ext]'
    });

    const stylusUse = [
        {
            loader: 'css-loader',
            options: {
                minimize: options.minimize,
                url: true
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins: function (loader) {
                    return [
                        new IconfontWebpackPlugin(loader),
                        /*
                        require('postcss-sprites')({
                            spritePath:     tempSpritePath,
                            filterBy: function(image) {
                                // Allow only png and svg files
                                if (!/\.(png|svg)$/.test(image.url)) {
                                    return Promise.reject();
                                }

                                return Promise.resolve();
                            }
                        }),
                        */
                        require('autoprefixer'),
                    ];
                }
            }
        },
        {
            loader: 'stylus-loader',
            options: {
                paths: resolvePaths.slice().reverse(),
                //preferPathResolver: 'webpack'
            }
        }
    ];

    return {
        entry: options.entry,
        output: {
            filename:   '[name].[chunkhash:8].js',
            path:       options.server.assets,
            publicPath: options.server.assetsUrl
        },
        resolve: {
            plugins: [
                new DirectoryNamedPlugin({
                    honorIndex: false,
                    transformFn: function(dirName) {
                        // Use only block/block.js, not block/block.json
                        return path.format({name: dirName, ext: '.js'});
                    }
                })
            ],
            modules: resolvePaths
        },
        module: {
            rules: [
                /*
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 0
                            }
                        }
                    ],
                    // Exclude sprites created by postcss
                    exclude: path.resolve(options.server.assets, '*.*')
                },
     */
                {
                    test: /locales\\.*\.(json)$/,
                    use: localePlugin.loader()
                },

                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                        publicPath: ''
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.styl$/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: stylusUse
                    })
                },
                {
                    test: /\.pug$/,
                    use: {
                        loader: 'pug-loader',
                        options: {
                            pretty: false,
                            root: path.resolve(__dirname, '../')
                        }
                    }
                }
            ],
            noParse: /jquery\.js/
        },
        plugins: [
            new CleanWebpackPlugin([
                options.server.assets,
                options.server.templates
            ], {
                root: options.server.root
            }),

            new webpack.WatchIgnorePlugin([
                tempSpritePath,
                options.server.assets,
                options.server.templates
            ]),

            new ExtractTextPlugin({
                filename: '[name].[contenthash:8].css'
            }),

            localePlugin,

            options.minimize ? new webpack.optimize.UglifyJsPlugin() : function() {},

            new FastredBemWebpackPlugin(options),

            liveReload
        ].concat(options.plugins ? options.plugins : []),
        stats: {
            warnings: false,
            modules: false,
            hash: false,
            version: false,
        }
    };
}

module.exports = FastredBemWebpackConfig;
