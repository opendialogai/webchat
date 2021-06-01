<?php

namespace OpenDialogAi\Webchat\Casts;

use OpenDialogAi\Webchat\WebchatSetting;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;

class WebchatSettingsValueCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  WebchatSetting  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return mixed
     */
    public function get($model, $key, $value, $attributes)
    {
        switch ($model->type) {
            case WebchatSetting::STRING:
            case WebchatSetting::COLOUR:
                return (string) $value;
            case WebchatSetting::BOOLEAN:
                return boolval($value);
            case WebchatSetting::NUMBER:
                return intval($value);
            default:
                return $value;
        }
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
     * @param  string  $key
     * @param  mixed  $value
     * @param  array  $attributes
     * @return mixed
     */
    public function set($model, $key, $value, $attributes)
    {
        switch ($model->type) {
            case WebchatSetting::STRING:
            case WebchatSetting::COLOUR:
            case WebchatSetting::NUMBER:
                return (string)$value;
            case WebchatSetting::BOOLEAN:
                return $value === true ? "1" : "0";
            default:
                return $value;
        }
    }
}
