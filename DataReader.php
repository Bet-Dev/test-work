<?php

/**
 * @return array
 */
function readDataJson (): array
{
    $data = file_get_contents('data.json');
    $data = json_decode($data, true);
    return $data;
}

/**
 * @param array $data
 * @param string $filter
 * @param string $check
 * @return array
 */
function filterBy ($data, $filter, $check): array
{
    $result = [];
    foreach ($data as $value) {
        if (checkPolicy($check, $value[$filter])) {
            $result[] = $value;
        }
    }
    return $result;
}

/**
 * @param $check
 * @param $value
 * @return bool
 */
function checkPolicy ($check, $value): bool {
    $first = substr($check, 0, 1);
    $rest = substr($check, 1);

    switch ($first) {
        case '!':
            return $rest != $value;
        case '>':
            return intval($rest) < intval($value);
        case '<':
            return intval($rest) > intval($value);
        default:
            return $check === $value;
    }
}

/**
 * @param array $data
 * @param number $limit
 * @return array
 */
function limitBy ($data, $limit): array
{
    $result = [];
    for ($i = 0; $i < $limit; $i++) {
        $result[] = $data[$i];
    }
    return $result;
}
