import React, { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSelector } from 'react-redux';
import { t } from 'react-native-tailwindcss';
import PropTypes from 'prop-types';

import i18n from '../../../plugins/i18n.js';

import { selectAuthUser, selectLead } from '../../../store/selectors.js';

import { ActivixButton, ActivixComment, ActivixIllustration, EmptyState } from '../../../components/index.js';

import useScrollToInitialContent from '../../../hooks/useScrollToInitialContent.jsx';
import { AddNoteSelectModal } from '../../Modal/index.js';
import { TAB_NOTES } from './ClientCardScreen.jsx';

const Comments = ({ initialTab, isDuplicateView }) => {
    const lead = useSelector(selectLead);
    const authUser = useSelector(selectAuthUser);

    const comments = useMemo(() => formatedComments(), [lead.comments]);

    const scrollViewRef = useRef(null);

    const [initialComment, setInitialComment] = useState();

    const scrollViewContainerStyle = comments.length ? t.pY4 : t.flex1;

    useScrollToInitialContent(initialTab, TAB_NOTES, initialComment, scrollViewRef);

    function formatedComments() {
        return lead.comments
            .filter(comment => !comment.parent_id)
            .map(comment => ({
                ...comment,
                children: getCommentChildren(comment),
            }));
    }

    function getCommentChildren(parent) {
        return lead.comments
            .filter(comment => comment.parent_id === parent.id)
            .map(child => ({
                ...child,
                children: getCommentChildren(child),
            }));
    }

    async function onAddComment() {
        if (isDuplicateView) {
            return undefined;
        }

        return AddNoteSelectModal.show();
    }

    return (
        <ScrollView
            contentContainerStyle={[scrollViewContainerStyle]}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps={'always'}
            ref={scrollViewRef}
        >
            {!isDuplicateView && comments.length > 0 && (
                <View style={[t.p4]}>
                    <ActivixButton type={'default'} onPress={onAddComment}>
                        {i18n.t('addLead.addNotes.button')}
                    </ActivixButton>
                </View>
            )}

            {comments.length ? (
                comments.map(comment => {
                    if (comment.private && authUser.id !== comment.user.id) {
                        return <React.Fragment />;
                    }

                    return (
                        <View key={comment.id} style={[t.pX4]}>
                            <ActivixComment
                                comment={comment}
                                authUser={authUser}
                                initialTab={initialTab}
                                setInitialComment={setInitialComment}
                                isDuplicateView={isDuplicateView}
                            />
                        </View>
                    );
                })
            ) : (
                <EmptyState
                    style={[t.flex1, t.itemsCenter, t.justifyCenter, t.bgWhite]}
                    icon={(
                        <ActivixIllustration name={'note-blank-2'} size={175} margin={-15} />
                    )}
                    label={i18n.t('addLead.addLeadSuccess.notes.noNotes')}
                    onPress={isDuplicateView ? undefined : onAddComment}
                />
            )}
        </ScrollView>
    );
};

Comments.propTypes = {
    initialTab: PropTypes.object,
    isDuplicateView: PropTypes.bool,
};

Comments.defaultProps = {
    initialTab: null,
    isDuplicateView: false,
};

export default Comments;
