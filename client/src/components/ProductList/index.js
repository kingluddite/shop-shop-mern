import React, { useEffect } from "react";
import ProductItem from "../ProductItem";
import { useStoreContext } from "../../utils/GlobalState";
import { UPDATE_PRODUCTS } from "../../utils/actions";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_PRODUCTS } from "../../utils/queries";
import spinner from "../../assets/spinner.gif";

// we remove the prop being passed in
function ProductList() {
  // we immediately execute the useStoreContext() function
  //  to retrieve the current gloabl state object
  // and the dipatch method to update state
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  // useEffect() Hook is used to wait for our useQuery() response to come it
  useEffect(() => {
    // once the data object changes from undefined to having an actual value
    if (data) {
      // we execute the dispatch (now that we have data)
      dispatch({
        // instruct our reducer function that it's the UPDATE_PRODUCTS action
        // and it should save the array of product data to our global store
        // when that's done useStoreContext() executes again
        // giving us the product data needed to display the products to the page
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
    }
  }, [data, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  // we need to update our return to now use `state.products.length`
  // since we are now retrieving products from the state object
  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
