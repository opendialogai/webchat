<?php

namespace OpenDialogAi\Webchat\WebchatSettingsConfiguration\Service;

class WebchatSettingsConfigurationPageInformation
{
    private $pageUrl;
    private $userId;
    private $width;
    private $callbackId;

    /** @var array */
    private $queryParameters = [];

    /** @var array */
    private $tags = [];

    /**
     * @param $pageUrl
     */
    public function __construct($pageUrl)
    {
        $this->pageUrl = $pageUrl;
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
     * @param mixed $userId
     */
    public function setUserId($userId): void
    {
        $this->userId = $userId;
    }

    /**
     * @return mixed
     */
    public function getWidth()
    {
        return $this->width;
    }

    /**
     * @param mixed $width
     */
    public function setWidth($width): void
    {
        $this->width = $width;
    }

    /**
     * @return mixed
     */
    public function getCallbackId()
    {
        return $this->callbackId;
    }

    /**
     * @param mixed $callbackId
     */
    public function setCallbackId($callbackId): void
    {
        $this->callbackId = $callbackId;
    }

    /**
     * @return array
     */
    public function getQueryParameters(): array
    {
        return $this->queryParameters;
    }

    /**
     * @param array $queryParameters
     */
    public function setQueryParameters(array $queryParameters): void
    {
        $this->queryParameters = $queryParameters;
    }

    /**
     * @return array
     */
    public function getTags(): array
    {
        return $this->tags;
    }

    /**
     * @param array $tags
     */
    public function setTags(array $tags): void
    {
        $this->tags = $tags;
    }
}
