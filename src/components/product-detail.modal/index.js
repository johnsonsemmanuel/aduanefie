import React from "react";
import PropTypes from "prop-types";
import { Box, Modal } from "@mui/material";
import ProductDetailsSection from "../product-details/product-details-section/ProductDetailsSection";
import { useSelector } from "react-redux";
import {Scrollbar} from "../srollbar";

const ProductDetailModal = (props) => {
  const { open, handleModalClose, product } = props;
  const { configData } = useSelector((state) => state.configData);
  return (
    <Modal open={open} onClose={handleModalClose} disableAutoFocus={true}>
      <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", maxWidth: "800px", width: "100%", borderRadius: "10px", boxShadow: 24, bgcolor: "background.paper", ...{ bgcolor: "background.paper" } }}>
          <Scrollbar style={{maxHeight:'100%'}}>
              <ProductDetailsSection
                  productDetailsData={product}
                  configData={configData}
                  productUpdate
                  handleModalClose={handleModalClose}
              />
          </Scrollbar>

      </Box>
    </Modal>
  );
};

ProductDetailModal.propTypes = {};

export default ProductDetailModal;
