# Zarathu Blog

Zarathu Official Blog - <https://blog.zarathu.com>

[![Website](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?label=blog.zarathu.com)](http://blog.zarathu.com) [![Netlify Status](https://api.netlify.com/api/v1/badges/3b41765e-c008-499f-93c4-83fdbe833cd8/deploy-status)](https://app.netlify.com/sites/zarathublog/deploys) [![GitHub issues](https://img.shields.io/github/issues/zarathucorp/blog.svg)](https://github.com/zarathucorp/blog/issues) [![GitHub license](https://img.shields.io/github/license/zarathucorp/blog.svg)](https://github.com/zarathucorp/blog/blob/master/LICENSE)

## 아티클 추가 하는 방법

1.  개인 계정으로 zarathucorp/blog 를 **Fork**
2.  로컬에 **Clone**
3.  Rstudio에서 **blog/zarathucorp.Rproj**을 열기
4.  **blog/posts**로 이동
5.  아티클을 담을 디렉토리 **생성**, 이때 형식은 `YYYY-MM-DD-TITLE` (다른 예시 참조)
6.  생성한 디렉토리로 이동 후 `index.qmd` 생성
7.  YAML 작성 예시 (render 에러가 날 경우 **Indent**, **tab** 확인)
수정 해야 하는 것은 `title`, `description`, `categories`, `author`, `date`

> [!IMPORTANT]  
> categories는 R이나 API 와 같이 대문자가 원어인 경우를 제외하고 전부 소문자로 표기

``` {yaml}
---
title: "pkgdown을 활용한 R 패키지 문서화"
description: | 
  R 패키지를 다른 사람들도 잘 활용할 수 있게 설명해주는 웹사이트를 pkgdown을 사용하여 만들어보자
categories:
  - R
  - rpackage
  - pkgdown
  - githubpage
  - documentation
  - website
author:
  name: "Jinhwan Kim"
  email: jinhwan@zarathu.com
  url: https://github.com/jhk0530
image: img/logo.png
fig_width: 400
date: 2023-03-15
format: html
execute:
  freeze: true
draft: false
license: CC BY-NC
---
```

8.  아티클을 `index.qmd`에 이어서 작성 후 **Knit**
9.  이때 이미지는 디렉토리내의 `/img`를 활용하길 권장
10. 로컬에 **Commit**
11. zarathucorp/blog에 **Pull Request** 생성
12. 검토 후 **Merge**
13. 끝

## 아티클에 revealjs (quarto 슬라이드) 올리는 방법

> **2023-02-01-streamlit** 디렉토리 참조

1.  생성한 디렉토리에 추가로 **슬라이드 qmd 파일 작성**

2.  **Knit**

3.  `index.qmd` 에 아래의 예시를 참조하여 iframe 추가

-   src에 `/posts` 추가한 **슬라이드 qmd의 html결과를 참조**하게 함
-   슬라이드 qmd에서는 **반드시 yaml에 draft: true** 있어야 함.
-   슬라이드 html이 생기지 않는 경우 render 후 `Ctrl + S`로 저장하기

```         
<iframe class="slide-deck" src="/posts/2023-02-01-streamlit/streamlit_slide.html" width="750px" height="500px" style="border: solid 1px black">

</iframe>
```

```{YAML}
---
format:
  revealjs:
    theme: default
    incremental: true
    auto-animate-easing: ease-in-out
    auto-animate-unmatched: false
    auto-animate-duration: 0.8
    transition: slide
    background-transition: fade
    chalkboard:
      theme: whiteboard
      boardmarker-width: 5
      buttons: false
    standalone: true
execute: 
  freeze: true

draft: true
---

```

## 아티클에 webR 추가하는 방법

1.  qmd 파일에 아래 내용 추가

``` html
## webR Test

```{=html}
<link rel="stylesheet" href="../../webr/codemirror.min.css">
<script src="../../webr/codemirror.min.js"></script>
<script src="../../webr/r.js"></script>
<script src='webr-worker.js'></script> 
<script src='webr-serviceworker.js'></script> 
<script type="module" src='editor.js'></script>

<h4>Editor</h4>
<div id="editor"></div>

<p style="text-align:right;">
  <button class="btn btn-success btn-sm" type="button" id="runButton">
    Loading webR...
  </button>
</p>

<h4>Result</h4>
<pre><code id="out"></code></pre>
```

2.  qmd가 위치한 디렉토리 (`YYYY-MM-DD`)에 `blog/webR` 디렉토리에서 3개 파일 복사

-   `webr-worker.js`
-   `webr-serviceworker.js`
-   `editor.js`

3.  복사한 `editor.js` 에서 초기 코드 수정 6번째 줄, `value: ...` 이때 코드의 줄구분은 **엔터 대신 \n**으로 표기 해야함
