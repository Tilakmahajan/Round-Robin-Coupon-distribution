
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";

const coupons = ["SAVE10", "DISCOUNT20", "OFFER30", "PROMO40"];
const cooldownTime = 60000; // 1-minute cooldown

export default function CouponDistributor() {
  return (
    <div className="container">
      <Toaster position="top-center" reverseOrder={false} />
      <CarsContainer />
    </div>
  );
}

function CarsContainer() {
  const [userId, setUserId] = useState(null);
  const [coupon, setCoupon] = useState(null);
  const [lastClaimTime, setLastClaimTime] = useState(null);

  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    let storedClaimTime = localStorage.getItem("lastClaimTime");

    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }

    setUserId(storedUserId);
    if (storedClaimTime) setLastClaimTime(parseInt(storedClaimTime));
  }, []);

  const getCoupon = () => {
    const now = Date.now();

    if (lastClaimTime && now - lastClaimTime < cooldownTime) {
      toast.error("⏳ Please wait before claiming another coupon!");
      return;
    }

    const couponIndex = userId.split("-").reduce((acc, char) => acc + char.charCodeAt(0), 0) % coupons.length;
    const assignedCoupon = coupons[couponIndex];

    setCoupon(assignedCoupon);
    setLastClaimTime(now);
    localStorage.setItem("lastClaimTime", now.toString());

    toast.success(`🎉 Coupon Claimed: ${assignedCoupon}`);
  };

  return (
    <div className="cars-container">
      <Car coupon={coupon} getCoupon={getCoupon} />
    </div>
  );
}

function Car({ coupon, getCoupon }) {
  return (
    <div className="car">
      <h2 className="title">Claim Your Coupon!</h2>
      {coupon ? (
        <p className="coupon-text">Your Coupon: {coupon}</p>
      ) : (
        <button onClick={getCoupon} className="claim-button">Claim Coupon</button>
      )}
    </div>
  );
}
