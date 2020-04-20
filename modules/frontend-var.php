<?php

if (!defined('FRONTEND_VAR_FILEPATH')) {
    fastredRequire('script');
    /**
     * @var string
     */
    define('FRONTEND_VAR_FILEPATH', SCRIPT_ROOT_PATH . 'frontend-var.json');
}

function frontendVar($key) {
    fastredRequire('str', 'obj', 'var');

    $vars = objFromJsonFileCached(FRONTEND_VAR_FILEPATH);
    $units = ['rem', 'px', 'ms', 's'];

    $value = isset($vars->{$key}) ? $vars->{$key} : null;

    if (varIsStr($value)) {
        $float = (float)$value;
        $length = strlen($value);

        foreach ($units as $unit) {
            $unitLength = strlen($unit);

            if (
                substr($value, -$unitLength) === $unit &&
                is_numeric(substr($value, 0, $length - $unitLength))
            ) {

                switch ($unit) {
                    case 'rem':
                        $value = round($float * frontendVar('root__font-size'));
                        break;
                    case 'px':
                    case 'ms';
                        $value = round($float);
                        break;
                    case 's':
                        $value = round($float * 1000);
                }
                break;
            }
        }
    }

    return $value;
}