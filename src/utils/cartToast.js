import React from "react";
import toast from "react-hot-toast";

export const showAddedToCartToast = (t, router) => {
  toast.success(
    (toastObj) => (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
        <span>{t("Item added to cart")}</span>
        {router && (
          <button
            type="button"
            onClick={() => {
              toast.dismiss(toastObj.id);
              router.push("/checkout?page=cart");
            }}
            style={{
              background: "#67513A",
              color: "#ffffff",
              border: 0,
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t("View Cart")} →
          </button>
        )}
      </span>
    ),
    { duration: 4000 }
  );
};
