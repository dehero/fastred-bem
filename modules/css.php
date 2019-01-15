<?php

function cssBemClassArr($arg1) {
    fastredRequire('str');

    $args = func_get_args();
    $obj = call_user_func_array('cssClassObj', $args);

    $result = array();

    foreach ($obj as $key => $value) {
        if ($value) {
            if (strEndsWith($key, '_')) {
                $key = $key . $value;
            }
            $result[] = $key;
        }
    }

    return $result;
}