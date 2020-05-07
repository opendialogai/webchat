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
    public function setQueryParameters(?array $queryParameters): void
    {
        if (!is_null($queryParameters)) {
            $this->queryParameters = $queryParameters;
        }
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
    public function setTags(?array $tags): void
    {
        if (!is_null($tags)) {
            $this->tags = $tags;
        }
    }
}
