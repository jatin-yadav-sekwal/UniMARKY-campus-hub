# User Manual

**UniMARKY — one student account for campus life.**

This guide is for students, community moderators, superusers and campus admins.

---

## 1. Getting started

### 1.1 Create an account

1. Open https://unimarky.runs-on.dev.
2. Choose **Sign up** (or **Log in** if you already have an account).
3. Continue with Google or use your email and a password.
4. If email confirmation is enabled, open the confirmation link.

### 1.2 Complete onboarding

1. After your first sign-in you land on **Set up your profile**.
2. Select your **university**.
3. Enter a **10-digit mobile number**.
4. Choose **Complete setup**.

Your university decides which marketplace, communities, study material, stays, food and lost & found you see. To change campus later, update your university in **Profile**.

### 1.3 Sign in and out

- Sign in at `/auth`.
- Sign out from the sidebar (desktop) or the menu (mobile).
- Forgot your password? Use **Forgot password?** on the sign-in form, then open the email link and choose a new password.

---

## 2. The workspace

The sidebar on desktop (or the menu on mobile) links to every service:

| Item | What it is |
|---|---|
| Dashboard | Your recent activity + shortcuts |
| Marketplace | Buy and sell on campus |
| Communities | Clubs, batches and events |
| Study | Notes, papers and resources |
| Accommodation | PGs, hostels and flats |
| Food | Campus restaurants and menus |
| Lost & Found | Report or recover items |
| Profile | Account details, avatar, deletion |

The footer has Privacy, Terms, Universities and Cookies.

---

## 3. Marketplace

### Buy

1. Open **Marketplace**.
2. Filter by category or search.
3. Open an item to see photos, price, condition and description.
4. Use **Contact seller** if a phone number is available.

### Sell

1. Choose **List an item**.
2. Add a title, price, category, condition and description.
3. Attach a JPG, PNG, WebP or GIF (max 10 MB).
4. Publish. The item appears in your campus marketplace.

Manage your posts under **My listings**; edit or delete from there. Only you (or an admin) can change your listing.

---

## 4. Lost & Found

1. Open **Lost & Found** → **Report item**.
2. Choose **Lost** or **Found**.
3. Add the item name, location, description and an optional photo.
4. Publish. Reports are visible to your university.
5. When recovered, edit the report and set the status to **Resolved**.

Use the tabs to filter lost/found and the search box to find an item.

---

## 5. Food

1. Open **Food** to see restaurants around your campus.
2. Filter by cuisine.
3. Open a restaurant to see its menu, prices, ratings and veg/non-veg markers.
4. Open a dish for its detail.

Superusers can add or edit restaurants and menu items from **Superuser → My listings**.

---

## 6. Accommodation

1. Open **Accommodation**.
2. Filter by PG, Hostel or Apartment.
3. Open a stay to see photos, rent range, amenities, location and contact.
4. Contact the host directly.

Superusers can add or edit stays the same way.

---

## 7. Study

1. Open **Study**.
2. Filter by department, year and category.
3. Open or download a resource.

Superusers can upload new material; uploads appear for the same university.

---

## 8. Communities

### Join and post

1. Open **Communities** and search or browse.
2. Choose **Join**.
3. Open the community and write a post (optionally with an image).
4. Comment on posts; authors and moderators can delete.

### Create and manage

- Anyone with the `community.create` permission can create a community; the creator becomes its moderator.
- Moderators can edit the community, change member roles, remove members and delete posts/comments.
- Use **Manage** on the community card.

---

## 9. Profile and account

### Edit your profile

1. Open **Profile**.
2. Update name, department, class or mobile number.
3. Save. Your avatar can be replaced by hovering it.

### Request a role

1. Open **Request role**.
2. Explain why you need superuser access.
3. An admin reviews the request. Approved users can manage food, accommodation and study content.

### Delete your account

1. Open **Profile** → **Delete account**.
2. Type `DELETE` and confirm.
3. Your profile, listings, reports, posts, comments and memberships are removed. Communities you created are handed to another moderator or removed if empty. You are signed out.

This cannot be undone. Use a throwaway account when testing.

---

## 10. For superusers

From **Superuser** you can:

- add/edit restaurants and menus;
- add/edit accommodation;
- upload study material;
- see your listings and delete them.

Only content for your university is shown.

## 11. For admins

From **Admin** you can:

- review pending role requests and approve/reject them;
- manage campus content and users;
- rely on the audit log for privileged actions.

---

## 12. Cookies and privacy

- On your first visit, a notice explains that UniMARKY uses essential storage to keep you signed in and remember the choice.
- **Accept** or **Decline optional** records your preference. No advertising or analytics trackers are used.
- Reopen the notice any time with **Cookies** in the footer.
- Read the full policy at `/privacy`.

---

## 13. Troubleshooting

| Problem | What to try |
|---|---|
| “Checking your session” for a long time | Refresh; check your connection; sign in again |
| Onboarding keeps returning | Complete university + 10-digit mobile; sign out/in; contact support if it persists |
| No listings/food/stays | You see only your university; check Profile → university |
| Password reset link goes to the home page | The link may have expired; request a new one. The site must allow the reset redirect |
| Image upload rejected | Use JPG/PNG/WebP/GIF under 10 MB |
| A page says 404 | The link may be outdated; use the menu or the home page |
| Can't post in a community | Join it first; only members can post |
| Admin actions unavailable | Your account role is `normal`; request superuser or ask an admin |

## 14. Support

- Use **Contact** in the footer.
- Include the page, what you expected, what happened and a screenshot if possible.
- For account deletion or data questions, use the contact email listed in the privacy policy.
