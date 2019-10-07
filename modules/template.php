<?php

fastredRequire('app');

const TEMPLATE_PATH = APP_PATH . 'templates/';

const TEMPLATE_CACHE_PATH = APP_CACHE_PATH . 'templates/';

const TEMPLATE_CACHE_CHECK = true;

function templateAttrsToObj($attributes) {
    return varIsStr($attributes)
        ? ['class' => $attributes]
        : (varIsHash($attributes) ? $attributes : []);
}

function templateToHtml($input, $options = null, $attributes = null) {
    fastredRequire('file', 'var');

    static $pug;

    if (!is_object($pug)) {
        $pug = new Pug\Pug([
            'cache' => TEMPLATE_CACHE_PATH,
            'mixin_merge_mode' => 'replace',
            'basedir' => TEMPLATE_PATH,
            'pretty' => false,//!app()->debug,
            'expressionLanguage' => 'js',
            'strict' => true,
            'upToDateCheck' => TEMPLATE_CACHE_CHECK
        ]);
    }

    $vars = [
        'options' => varIsHash($options) ? $options : [],
        'attributes' => templateAttrsToObj($attributes)
    ];

    $path = TEMPLATE_PATH . "$input.pug";

    if (!fileExists($path)) {
        $path = $input;
    }

    try {
        return $pug->renderFile($path, $vars);
    } catch(Exception $e) {
        return $path;
    }
}
