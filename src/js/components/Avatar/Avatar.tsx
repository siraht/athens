import React from 'react';
import styled from 'styled-components';
import { Fade, Popper, PopperPlacementType } from '@material-ui/core';
import { readableColor } from 'polished';

import { DOMRoot } from '../../config';

const AvatarWrap = styled.svg`
  overflow: visible;
  cursor: default;
  border-radius: 100%;
  height: var(--size, 1.5em);
  width: var(--size, 1.5em);
`;

const Name = styled.text`
  text-anchor: middle;
  color: var(--avatar-text-color);
  transform: scale(0.8);
  transform-origin: center;
`;

const FullName = styled.span`
  background: var(--tooltip-background-color);
  color: var(--tooltip-text-color);
  display: inline-flex;
  width: max-content;
  line-height: 1;
  padding: 0.2em 0.5em;
  border-radius: 0.2em;
  margin: 0.25rem;
  pointer-events: none;
`;

export interface AvatarProps extends React.SVGProps<SVGSVGElement>, Person {
  /**
  * The primary color of the icon
  */
  color: string;
  /**
   * The full username of the person
   */
  username: string;
  /**
   * Height and width of the avatar
   */
  size?: string;
  /**
   * Whether to display the avatar in a muted visual style
   */
  isMuted?: boolean;
  /**
   * Whether to show the user's full name. Set to 'hover' to show it when interacting with the icon.
   */
  showTooltip?: boolean | 'hover';
  /**
   * Where the tooltip should appear relative to the icon.
   */
  tooltipPlacement?: PopperPlacementType
}

/**
 * Visual representation of a human user
*/
export const Avatar = ({
  username,
  color,
  showTooltip = 'hover',
  tooltipPlacement = 'right',
  isMuted = false,
  size,
  ...props
}: AvatarProps) => {
  const [avatarEl, setAvatarEl] = React.useState();
  const [isShowingTooltip, setIsShowingTooltip] = React.useState(showTooltip === 'hover' ? false : showTooltip);

  const avatarColors = {
    "--avatar-background-opacity": isMuted ? 0.2 : 1,
    "--avatar-background-color": color,
    "--avatar-text-color": isMuted ? color : readableColor(color),
    "--tooltip-text-color": readableColor(color),
    "--tooltip-background-color": color,
  }

  let initials;
  if (username) {
    initials = username.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <>
      <AvatarWrap
        viewBox="0 0 24 24"
        ref={setAvatarEl}
        onMouseOver={() => { if (showTooltip === 'hover') setIsShowingTooltip(true) }}
        onMouseLeave={() => { if (showTooltip === 'hover') setIsShowingTooltip(false) }}
        {...props}
        style={{ ...avatarColors, "--size": size, ...props.style }}
      >
        <circle
          cx="12"
          cy="12"
          r="12"
          fill="var(--avatar-background-color)"
          fillOpacity="var(--avatar-background-opacity)"
        />
        <Name
          x="12"
          y="18"
          fill="var(--avatar-text-color"
          vectorEffect="non-scaling-stroke"
          stroke={readableColor(readableColor(color))}
          strokeWidth="2px"
          strokeOpacity="0.25"
          paintOrder="stroke fill"
          fontSize="18"
        >
          {initials || username}
        </Name>
      </AvatarWrap>
      <Popper
        open={showTooltip === true || isShowingTooltip}
        anchorEl={avatarEl}
        disablePortal={true}
        container={DOMRoot}
        placement={tooltipPlacement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={250}>
            <FullName
              className={"tooltip-" + tooltipPlacement}
              style={avatarColors}
            >{username}</FullName>
          </Fade>
        )}
      </Popper>
    </>
  );
};


/* 
* Wraps a horizontal series of avatars and causes them to overlap each other.
*/
interface AvatarStackProps {
  /**
   * The width of the mask added to overlapping Avatars.
   */
  maskSize?: string,
  /**
   * The size of Avatars. Can be overridden by the same property on child Avatars.
   */
  size?: string,
  /**
   * How much Avatars should overlap. 0.5 is 50% overlap.
   */
  overlap?: number
}

Avatar.Stack = styled.div<AvatarStackProps>`
  --mask-size: ${props => props.maskSize || '3px'};
  --size: ${props => props.size || undefined};
  --stack-overlap: ${props => props.overlap || '0.5'};
  display: inline-flex;

  ${AvatarWrap} {
    &:not(:first-of-type) {
      margin-inline-start: calc(var(--size, 1.5em) * (var(--stack-overlap) * -1));
      mask-image: radial-gradient(
        calc(var(--size, 1.5em) + var(--mask-size)) calc((var(--size, 1.5em) * (2 / 3)) + var(--mask-size)) at calc(-100% + (100% * (var(--stack-overlap)))) 50%,
        transparent 99%,
        #000 100%);
    }
  }
`;