# VineNote

[中文文档](https://github.com/NealST/VineNote/blob/main/README.zh-CN.md)

<img src="https://img.alicdn.com/imgextra/i1/O1CN01kT9jMJ27VpYqXreD2_!!6000000007803-1-tps-2600-1600.gif" style="border-radius:6px;" alt="demo" />

## Preface

VineNote is a lightweight, cross-platform, sleek note app with powerful edit expericence and high performance. It's developed based on some outstanding technology stacks including tauri, react, shadcn/ui, tailwindcss, zustand and so on.

## Why I created it

I am fond of writing. I have tried many different note apps, but none of them can meet my requirements. What I want is a product that combines lightweight package and powerful edit experience. 

Most of current note apps are built base on electron that results to oversized package and terrible memory consumption, I have met with the memory danger alert many times due to these apps, it's frustrating.

Although some apps is written in native way such as swift for macos, but their edit experience is not powerful enough. 

Most of them claim markdown first. However, they do not have the ability to format markdown in real-time, which results to that you need a preview panel to check the display of your writing and this panel will minimize your writing area. At the same time, they have no rich and efficient toolbars, so that as an editor, you must keep all the markdown syntax in mind, if you forget syntax for some special module such as table, you need to search for it and write it. These behavior will break your thinking and then slow down your productivity greatly.

On the other hand, many note apps have a lot of redundent features that are irrelevant to writing and all of my writing data is stored in their cloud database, which distracts me and give me a great anxiety that whether my data is sustainable in future. At the same time, their online service brings unstable running, I have met with some unavailable service cases.

This is why I created VineNote, I want to build a perfect note app for myself and now, I have a great desire to share with you, I believe that it's also useful for you and you will like it.

## Advantages in VineNote

* Powerful
  * Supports internationalization, dark mode, multi-format file export, tag-based file categorization, and a focus mode writing experience
  * Supports auto-formatted display of Markdown syntax with real-time rendering, eliminating the need for previews
  * Offers extensive toolbars and keyboard shortcuts, supports multiple module types with syntax highlighting, and features one-click TOC generation.

* Lightweight
  * With cross-platform support, the installation package is just 25MB in size, featuring no embedded Chromium and minimal memory consumption
  * The product implementation retains only the most essential elements for writing and file management, embodying a minimalist design with no redundancies
  * The backend, written in Rust, delivers exceptional performance for file operations and keyword search

* Sleek
  * A clean three-column layout with folder panel, file list, and editor, enabling intuitive navigation and interaction at a glance
  * Built on shadcn/ui's foundational components paired with a unified icon design system, the UI presentation and interactions showcase exquisite attention to detail
  * The chinease font defaults to Canger JinKai, showcasing elegant typography
  
* Secure
  * All files are stored locally, ensuring the security and ownership of your data assets
  * The application runs entirely locally and works offline, eliminating concerns about service reliability
  * No user data is ever uploaded; the project is open-source and transparent in its operations

