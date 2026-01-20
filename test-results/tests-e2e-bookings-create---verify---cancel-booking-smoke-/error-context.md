# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic:
      - generic:
        - progressbar
    - generic [ref=e4]:
      - heading "Podium Corporate" [level=2] [ref=e6]
      - generic [ref=e8]:
        - group [ref=e9]:
          - generic [ref=e10]: Email*
          - textbox "Email" [ref=e11]:
            - /placeholder: corporate@empresa.com
        - group [ref=e12]:
          - generic [ref=e13]: Password*
          - textbox "Password" [ref=e14]:
            - /placeholder: "*******"
        - button "Entrar" [ref=e15] [cursor=pointer]
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```