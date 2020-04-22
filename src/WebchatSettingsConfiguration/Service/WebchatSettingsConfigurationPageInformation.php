<?php


namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service;


class WebchatSettingsConfigurationPageInformation
{
    private $pageUrl;
    private $userId;
    private $width;
    private $callbackId;

    /**
     * @param $pageUrl
     * @param null $userId
     * @param $width
     * @param $callbackId
     */
    public function __construct($pageUrl, $userId = null, $width = null, $callbackId = null)
    {
        $this->pageUrl = $pageUrl;
        $this->userId = $userId;
        $this->width = $width;
        $this->callbackId = $callbackId;
    }

    /**
     * @return mixed
     */
    public function getPageUrl()
    {
        return $this->pageUrl;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @return mixed
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @return mixed
     */
    public function getCallbackId()
    {
        return $this->callbackId;
    }
}
